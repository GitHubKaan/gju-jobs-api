import { v4 as uuidv4 } from "uuid";
import { DBPool } from "../configs/postgreSQL.config";
import { UUID } from "node:crypto";
import { ApplicationQueries } from "../queries/application.queries";
import { DefaultError } from "../utils/error.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE } from "../../responseMessage";

export class ApplicationService {
    /**
     * Add application
     * @param jobUUID
     * @param studentUUID
     * @throws {DefaultError} Already applied for that job
    */
    static async add(
        jobUUID: UUID,
        studentUUID: UUID
    ): Promise<
        void
    > {
        const existsResult = await DBPool.query(
            ApplicationQueries.exists,
            [
                jobUUID,
                studentUUID
            ]
        );

        if (existsResult.rowCount && existsResult.rowCount >= 1) throw new DefaultError(StatusCodes.CONFLICT, MESSAGE.ERROR.ALREADY_APPLIED);

        await DBPool.query(
            ApplicationQueries.add,
            [
                uuidv4(),
                jobUUID,
                studentUUID
            ]
        );
    };
}