import { DBPool } from "../configs/postgreSQL.config";
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
        const query = `
            DELETE FROM users_student;
            DELETE FROM users_company;
        `;

        return new Promise((resolve, reject) => {
            DBPool.query(query, (error: any) => {
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
        const query = `
            SELECT version()
        `;
    
        try {
            const result = await DBPool.query(query);
            
            if (!result || result.rows.length === 0) {
                throw(new Error("Database offline."));
            }
    
            CONSOLE.SUCCESS("Database is online.");
        } catch (error: any) {
            CONSOLE.ERROR("Database is offline or connection settings are faulty.");
        }
    }
}