import { DBPool } from "../configs/postgreSQL.config";
import { TestingQueries } from "../queries/testing.queries";
import { CONSOLE } from "../utils/console.util";
import { addInternalError } from "../utils/internalError.util";

export class TestingService {
    /**
     * Delete all testing database table data
     */
    static async deleteTestingTables(

    ): Promise<
        void
    > {
        return new Promise((resolve, reject) => {
            DBPool.query(TestingQueries.deleteTestingTables, (error: any) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    }

    /**
     * Check if database connection is successfull
     */
    static async checkDBStatus(): Promise<void> {
        try {
            const result = await DBPool.query(TestingQueries.checkDBStatus);
            
            if (!result || result.rows.length === 0) throw(new Error("Database offline."));
    
            CONSOLE.SUCCESS("Database is online.");
        } catch (error: any) {
            CONSOLE.ERROR("Database is offline or connection settings are faulty.");
        }
    }
}