import { UUID } from "node:crypto";
import { PoolClient } from "pg";
import { DBPool } from "../configs/postgreSQL.config";
import { v4 as uuidv4 } from "uuid";
import { CreateJob, UpdateJob } from "../types/jobs.type";
import { unixSecondsToDbTimestamp } from "../utils/time.util";
import { JobsQueries } from "../queries/jobs.queries";
import { DefaultError } from "../utils/error.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE, TITLE } from "../../responseMessage";

export class JobsService {
    /**
     * Add new job
     * @param userUUID Company userUUID
     * @param payload CreateJob-payload
     * @returns Job UUID
    */
    static async add(
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
    static async update(
        userUUID: UUID,
        payload: UpdateJob
    ): Promise<
        void
    > {
        if (!payload) throw new DefaultError(StatusCodes.NOT_MODIFIED, "No values provided to update.");

        const fieldsToUpdate = {
            title: payload.title?.trimEnd().trimStart(),
            description: payload.description?.trimEnd().trimStart(),
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
    static async delete(
        userUUID: UUID,
        jobUUID: UUID
    ): Promise<
        void
    > {
        const result = await DBPool.query(JobsQueries.delete, [jobUUID, userUUID]);

        if (result.rowCount === 0) throw new DefaultError(StatusCodes.NOT_FOUND, MESSAGE.ERROR.NOT_FOUND(TITLE.JOB)); // userUUID and jobUUID probaply do not match
    }
}