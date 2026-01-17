import { UUID } from "crypto";
import { PoolClient } from "pg";
import { DBPool } from "../configs/postgreSQL.config";
import { v4 as uuidv4 } from "uuid";
import { CreateJob } from "../types/jobs.type";
import { unixSecondsToDbTimestamp } from "../utils/time.util";
import { JobsQueries } from "../queries/jobs.queries";

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
        await client.query(JobsQueries.ADD, [
            jobUUID,
            userUUID,
            payload.title,
            payload.description,
            payload.position,
            payload.exp ? unixSecondsToDbTimestamp(payload.exp) : null
        ]);

        // Add tags from job to db
        if (payload.tags?.length) {
            for (const tagId of payload.tags) {
                await client.query(JobsQueries.INSERT_TAGS, [
                    uuidv4(),
                    jobUUID,
                    tagId
                ])
            }
        }

        return jobUUID;
    };
}