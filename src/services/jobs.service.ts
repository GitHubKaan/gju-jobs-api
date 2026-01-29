import { UUID } from "node:crypto";
import { PoolClient } from "pg";
import { DBPool } from "../configs/postgreSQL.config";
import { v4 as uuidv4 } from "uuid";
import { CreateJob, RetrieveJobs, UpdateJob } from "../types/jobs.type";
import { formatDBTimestamp, unixSecondsToDbTimestamp } from "../utils/time.util";
import { JobsQueries } from "../queries/jobs.queries";
import { DefaultError } from "../utils/error.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE, TITLE } from "../../responseMessage";
import { decrypt } from "../utils/encryption.util";

export class JobsService {
    /**
     * Add new job
     * @param userUUID Company userUUID
     * @param payload CreateJob-payload
     * @returns Job UUID
    */
    public static async add(
        userUUID: UUID,
        payload: CreateJob,
    ): Promise<
        UUID
    > {
        const client: PoolClient = await DBPool.connect();

        const jobUUID: UUID = uuidv4() as UUID;

        // Add job to db
        await client.query(JobsQueries.add, [
            jobUUID,
            userUUID,
            payload.title.trimEnd().trimStart(),
            payload.description.trimEnd().trimStart(),
            payload.location.trimEnd().trimStart(),
            payload.position.trimEnd().trimStart(),
            payload.exp ? unixSecondsToDbTimestamp(payload.exp) : null
        ]);

        // Add tags from job to db
        if (payload.tags?.length) {
            for (const tagId of payload.tags) {
                await client.query(JobsQueries.insertTags, [
                    uuidv4(),
                    jobUUID,
                    tagId
                ])
            }
        }

        return jobUUID;
    };

    /**
     * Update a job
     * @param userUUID
     * @param payload UpdateJob
     * @throws {DefaultError} Job not found (maybe unauthorized access to jobUUID)
     */
    public static async update(
        userUUID: UUID,
        payload: UpdateJob
    ): Promise<
        void
    > {
        if (!payload) throw new DefaultError(StatusCodes.NOT_MODIFIED, "No values provided to update.");

        const fieldsToUpdate = {
            title: payload.title?.trimEnd().trimStart(),
            description: payload.description?.trimEnd().trimStart(),
            location: payload.location?.trimEnd().trimStart(),
            position: payload.position?.trimEnd().trimStart(),
            exp: payload.exp ? unixSecondsToDbTimestamp(payload.exp) : undefined,
        };

        const optionalClauses: string[] = [];
        const values: any[] = [userUUID, payload.jobUUID]; // First value ($1) is User UUID and second ($2) is job UUID

        Object.entries(fieldsToUpdate).forEach(([field, value]) => {
            if (value) {
                optionalClauses.push(`${field} = $${optionalClauses.length + 3}`);
                values.push(value);
            }
        });
        const joinedOptionalClauses = optionalClauses.join(", ");

        const result = await DBPool.query(JobsQueries.update(joinedOptionalClauses), values);
        
        if (result.rowCount === 0) throw new DefaultError(StatusCodes.NOT_FOUND, MESSAGE.ERROR.NOT_FOUND(TITLE.JOB)); // userUUID and jobUUID probaply do not match

        // --- Update tags ---
        if (payload.tags) {
            // Delete old tags from job (if "[]"" then tags will be deleted. This will not happen if tags are undefined (not provided by user -- to update))
            await DBPool.query(JobsQueries.deleteTagsByJob, [payload.jobUUID]);

            // Set new tags (!!! FIX LATER !!! not optimal in a loop, can be done directly inside query)
            if (payload.tags.length > 0) {
                const insertPromises = payload.tags.map((tagId) =>
                    DBPool.query(
                        JobsQueries.insertTags,
                        [
                            uuidv4(),
                            payload.jobUUID,
                            tagId
                        ]
                    )
                );

                await Promise.all(insertPromises);
            }
        }
    };

    /**
     * Delete job
     * @param userUUID
     * @param jobUUID
     * @throws {DefaultError} Job not found (maybe unauthorized access to jobUUID)
    */
    public static async delete(
        userUUID: UUID,
        jobUUID: UUID
    ): Promise<
        void
    > {
        const result = await DBPool.query(JobsQueries.delete, [jobUUID, userUUID]);

        if (result.rowCount === 0) throw new DefaultError(StatusCodes.NOT_FOUND, MESSAGE.ERROR.NOT_FOUND(TITLE.JOB)); // userUUID and jobUUID probaply do not match
    }

    /**
     * Count the total job amount
     * @returns Total jobs amount
    */
    public static async totalJobAmount(

    ): Promise<
        number
    > {
        const result = await DBPool.query(JobsQueries.countJobs);
        return result.rows[0].job_amount ?? 0;
    }

    /**
     * Retrieve jobs
     * @param payload RetrieveJobs-payload
     * @returns Jobs with company info
    */
    public static async retrieve(
        payload: RetrieveJobs,
    ): Promise<
        { jobs: any[] }
    > {
        const result = await DBPool.query(JobsQueries.retrieve);
        const rows = result.rows;

        // Group jobs by UUID and collect their tags
        const jobsMap = new Map<UUID, any>();

        for (const row of rows) {
            const jobUUID = row.uuid as UUID;
            
            // Build job object with tags and company info
            if (!jobsMap.has(jobUUID)) {
                jobsMap.set(jobUUID, {
                    uuid: jobUUID,
                    title: row.title,
                    description: row.description,
                    location: row.location,
                    position: row.position,
                    exp: row.exp ? formatDBTimestamp(row.exp) : undefined,
                    created: row.created ? formatDBTimestamp(row.created) : undefined,
                    tags: [],
                    companyInfo: {
                        userUUID: row.company_uuid,
                        email: row.email,
                        phone: row.phone ? decrypt(row.phone) : null,
                        company: decrypt(row.company),
                        description: row.company_description ? decrypt(row.company_description) : null,
                        givenName: decrypt(row.given_name),
                        surname: decrypt(row.surname),
                        size: decrypt(row.size),
                        industry: decrypt(row.industry),
                        country: decrypt(row.country),
                    }
                });
            }

            // Add tag if it exists
            if (row.tag_id !== null) {
                jobsMap.get(jobUUID)!.tags.push(row.tag_id);
            }
        }

        // Convert to array
        let jobs = Array.from(jobsMap.values());

        // Apply filtering and sorting logic
        if (payload.sort) {
            // If sort is specified, ignore tags
            if (payload.sort === "NEWEST") {
                jobs.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
            } else if (payload.sort === "OLDEST") {
                jobs.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
            }
        } else if (payload.tags && payload.tags.length > 0) {
            // Count matching tags and sort by match count (descending), then by created (descending)
            jobs = jobs.map(job => ({
                ...job,
                tagMatchCount: job.tags.filter((tag: number) => payload.tags!.includes(tag)).length,
            }));
            
            jobs.sort((a, b) => {
                if (b.tagMatchCount !== a.tagMatchCount) {
                    return b.tagMatchCount - a.tagMatchCount;
                }
                return new Date(b.created).getTime() - new Date(a.created).getTime();
            });

            // Remove tagMatchCount from final result
            jobs = jobs.map(({ tagMatchCount, ...job }) => job);
        } else {
            // Default: sort by newest
            jobs.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        }

        // Apply pagination
        const offset = (payload.page - 1) * payload.pageSize;
        const paginatedJobs = jobs.slice(offset, offset + payload.pageSize);

        return {
            jobs: paginatedJobs,
        };
    };

    /**
      * Get company userUUID from jobUUID
      * @param jobUUID
      * @returns userUUID
      */
    public static async getUserUUID(
        jobUUID: UUID,
    ): Promise<
        UUID
    > {
        const result = await DBPool.query(JobsQueries.getUserUUID, [jobUUID]);

        return result.rows[0].user_uuid;
    };

    /**
     * Retrieve own jobs
     * @param userUUID Company user uuid 
     * @returns Jobs from company
    */
    public static async retrieveOwn(
        userUUID: UUID
    ): Promise<
        { jobs: any[] }
    > {
        const result = await DBPool.query(JobsQueries.retrieveOwn, [userUUID]);
        const rows = result.rows;

        // Group jobs by UUID and collect their tags
        const jobsMap = new Map<UUID, any>();

        for (const row of rows) {
            const jobUUID = row.uuid as UUID;
            
            if (!jobsMap.has(jobUUID)) {
                jobsMap.set(jobUUID, {
                    uuid: jobUUID,
                    user_uuid: row.user_uuid,
                    title: row.title,
                    description: row.description,
                    location: row.location,
                    position: row.position,
                    exp: row.exp ? formatDBTimestamp(row.exp) : undefined,
                    created: row.created ? formatDBTimestamp(row.created) : undefined,
                    tags: [],
                });
            }

            // Add tag if it exists
            if (row.tag_id !== null) {
                jobsMap.get(jobUUID)!.tags.push(row.tag_id);
            }
        }

        const jobs = Array.from(jobsMap.values());

        return {
            jobs,
        };
    };
}