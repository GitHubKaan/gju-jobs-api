import { v4 as uuidv4 } from "uuid";
import { UUID } from "node:crypto";
import { DBPool } from "../configs/postgreSQL.config";
import { InternalErrorQueries } from "../queries/internalError.queries";

export class InternalErrorService {
    /**
     * Create new internal error entry in database
     * @param cause Error cause
     * @param backend Backend or frontend error? (if backend then true)
     * @returns Error UUID
     */
    static async create(
        cause: any,
        backend: boolean
    ): Promise<
        UUID
    > {
        const UUID = uuidv4() as UUID;
        const result = await DBPool.query(InternalErrorQueries.create, [UUID, backend, cause]);

        if (result.rows.length > 0) { //Should not be "result.rowCount"
            return result.rows[0].uuid;
        }

        return UUID;
    }

    /**
     * Check if internal error already part of database
     * @param cause Error cause
     * @returns UUID (If already exists) or null
     */
    static async isDuplicate(
        cause: any
    ): Promise<
        UUID | undefined
    > {
        const result = await DBPool.query(InternalErrorQueries.isDuplicate, [cause]);
        
        if (result.rowCount && result.rowCount > 0) {
            return result.rows[0].uuid;
        }

        return undefined;
    };
}