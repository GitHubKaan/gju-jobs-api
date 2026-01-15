import { DBPool } from "../configs/postgreSQL.config";
import { v4 as uuidv4 } from "uuid";
import { decrypt } from "../utils/encryption.util";
import { DefaultError } from "../utils/error.util";
import { MESSAGE, TITLE } from "../responseMessage";
import { StatusCodes } from "http-status-codes";
import { ENV } from "../utils/envReader.util";
import { UUID } from "crypto";
import { UUIDType } from "../enums";
import { randomString } from "../utils/stringGenerator.util";
import { hashValue } from "../utils/hash.util";

export class UserService {
    /**
     * Check if authUUID exists
     * @param authUUID
     * @param isStudent
     * @throws {DefaultError} Unauthorized token
     */
    static async isValidAuthUUID(
        authUUID: UUID,
        isStudent: boolean
    ): Promise<
        void
    > {
        const query = `
            SELECT 1
            FROM ${isStudent ? "users_student" : "users_company"}
            WHERE auth_uuid = $1
            LIMIT 1;
        `;

        const result = await DBPool.query(query, [authUUID]);

        if (result.rowCount && result.rowCount > 0) {
            return;
        }

        throw new DefaultError(StatusCodes.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED(TITLE.TOKEN));
    };

    /**
     * Get userUUID & authUUID by email
     * @param email
     * @param isStudent
     * @returns UUID (userUUID) & authUUID
     * @throws {DefaultError} Email not found
     */
    static async getUUIDs(
        email: string,
        isStudent: boolean,
    ): Promise<{
        UUID: UUID,
        authUUID: UUID
    }> {
        const query = `
            SELECT
                uuid,
                auth_uuid
            FROM ${isStudent ? "users_student" : "users_company"}
            WHERE email = $1;
        `;
       

        const result = await DBPool.query(query, [email]);

        if (result.rowCount && result.rowCount > 0) {
            return {
                UUID: result.rows[0].uuid,
                authUUID: result.rows[0].auth_uuid
            };
        }

        throw new DefaultError(StatusCodes.NOT_FOUND, MESSAGE.ERROR.NOT_FOUND(TITLE.E_MAIL_ADDRESS));
    };

    /**
     * Get Cooldown time
     * @param UUID userUUID
     * @param isStudent
     * @returns Cooldown time or null
     */
    static async getCooldown(
        UUID: UUID,
        isStudent: boolean
    ): Promise<
        string | null
    > {
        const query = `
            SELECT cooldown
            FROM ${isStudent ? "users_student" : "users_company"}
            WHERE uuid = $1;
        `;

        const result = await DBPool.query(query, [UUID]);

        return result.rows[0].cooldown;
    };

    /**
     * Get user data
     * @param UUID userUUID
     * @param isStudent
     * @returns User data
    */
    static async getUser(
        UUID: UUID,
        isStudent: boolean,
    ): Promise<
        any
    > {
        let query;
        if (isStudent) {
            query = `
                SELECT *
                FROM users_student
                WHERE uuid = $1;
            `;

            const result = await DBPool.query(query, [UUID]);

            return {
                UUID: result.rows[0].uuid,
                authUUID: result.rows[0].auth_uuid,
                email: result.rows[0].email,
                phone: result.rows[0].phone ? decrypt(result.rows[0].phone) : null,
                givenName: decrypt(result.rows[0].given_name),
                surname: decrypt(result.rows[0].surname),
                degree: result.rows[0].degree ? decrypt(result.rows[0].degree) : null,
                program: result.rows[0].program ? decrypt(result.rows[0].program) : null,
            }
        } else {
            query = `
                SELECT *
                FROM users_company
                WHERE uuid = $1;
            `;

            const result = await DBPool.query(query, [UUID]);

            return {
                UUID: result.rows[0].uuid,
                authUUID: result.rows[0].auth_uuid,
                email: result.rows[0].email,
                phone: result.rows[0].phone ? decrypt(result.rows[0].phone) : null,
                company: decrypt(result.rows[0].company),
                description: decrypt(result.rows[0].description),
                givenName: decrypt(result.rows[0].given_name),
                surname: decrypt(result.rows[0].surname),
                street: decrypt(result.rows[0].street),
                streetNumber: decrypt(result.rows[0].street_number),
                ZIPCode: Number(decrypt(result.rows[0].zip_code)),
                city: decrypt(result.rows[0].city),
                country: decrypt(result.rows[0].country),
                size: decrypt(result.rows[0].size),
                industry: decrypt(result.rows[0].industry),
            }
        }
    };

    /**
     * Set new cooldown time (automatically uses current time)
     * @param UUID userUUID
     * @param isStudent
     */
    static async setCooldown(
        UUID: UUID,
        isStudent: boolean
    ): Promise<
        void
    > {
        const query = `
            UPDATE ${isStudent ? "users_student" : "users_company"}
            SET cooldown = NOW()
            WHERE uuid = $1;
        `;

        await DBPool.query(query, [UUID]);
    };

    /**
     * Replace authUUID
     * @param authUUID Old authUUID
     * @param isStudent
     * @returns New authUUID
     */
    static async recover(
        authUUID: UUID,
        isStudent: boolean
    ): Promise<
        UUID
    > {
        const query = `
            UPDATE ${isStudent ? "users_student" : "users_company"}
            SET auth_uuid = $1
            WHERE auth_uuid = $2;
        `;

        const newAuthUUID = uuidv4() as UUID;

        await DBPool.query(query, [newAuthUUID, authUUID]);

        return newAuthUUID;
    };

    /**
     * Add auth code
     * @param UUID userUUID
     * @param isStudent -- else company
     * @return authCode
    */
    static async addAuthCode(
        UUID: UUID,
        isStudent: boolean,
    ): Promise<
        string
    > {
        const query = `
            UPDATE ${isStudent ? "users_student" : "users_company"}
            SET
                auth_code = $1,
                auth_code_created = NOW(),
                auth_code_attempt = 0
            WHERE uuid = $2;
        `;

        const authCode = randomString("0", ENV.AUTH_CODE_LENGTH);
        const hashedAuthCode = hashValue(authCode);

        await DBPool.query(query, [hashedAuthCode, UUID]);

        return authCode;
    };

    /**
     * Check if auth code attempt(s) left
     * @param UUID userUUID
     * @param isStudent
     * @throws {DefaultError} Authentication attempts used up
     */
    static async hasRemainingAuthAttempts(
        UUID: UUID,
        isStudent: boolean
    ): Promise<
        void
    > {
        const query = `
            SELECT *
            FROM ${isStudent ? "users_student" : "users_company"}
            WHERE uuid = $1
            AND auth_code_attempt < ${ENV.AUTH_MAX_ATTEMPTS};
        `;

        const result = await DBPool.query(query, [UUID]);

        if (result.rowCount && result.rowCount > 0) {
            return;
        }

        throw new DefaultError(StatusCodes.CONFLICT, MESSAGE.ERROR.ATTEMPTS_USED_UP(TITLE.AUTHENTICATION)); //No more attempts left
    };

    /**
     * Check if auth code valid
     * @param UUID userUUID
     * @param authCode
     * @param isStudent
     * @returns boolean
     */
    static async isValidAuthCode(
        UUID: UUID,
        authCode: string,
        isStudent: boolean
    ): Promise<
        boolean
    > {
        const query = `
                UPDATE ${isStudent ? "users_student" : "users_company"}
                SET
                    auth_code = NULL,
                    auth_code_attempt = 0,
                    auth_code_created = NULL
                WHERE uuid = $1
                AND auth_code = $2
                AND auth_code_created > NOW() - INTERVAL '${ENV.AUTH_EXP} seconds';
            `;

        const hashedAuthCode = hashValue(authCode);
        const result = await DBPool.query(query, [UUID, hashedAuthCode]);

        if (result.rowCount && result.rowCount > 0) {
            return true;
        }
        return false;
    };

    /**
     * Add authentication attempt
     * @param UUID userUUID
     * @param isStudent
     * @throws {DefaultError} Unauthorized authentication
     */
    static async addAuthAttempt(
        UUID: UUID,
        isStudent: boolean,
    ): Promise<
        void
    > {
        const query = `
                UPDATE ${isStudent ? "users_student" : "users_company"}
                SET auth_code_attempt = auth_code_attempt + 1
                WHERE uuid = $1;
            `;

        await DBPool.query(query, [UUID]);

        throw new DefaultError(StatusCodes.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED(TITLE.AUTHENTICATION));
    };

    /**
     * Get email from user/auth-UUID
     * @param UUID userUUID or authUUID
     * @param type UUID type
     * @param isStudent
     * @returns Email
     */
    static async getEmail(
        UUID: UUID,
        type: UUIDType,
        isStudent: boolean,
    ): Promise<
        string
    > {
            const userQuery = `
                SELECT email
                FROM ${isStudent ? "users_student" : "users_company"} 
                WHERE uuid = $1;
            `;
    
            const authQuery = `
                SELECT email
                FROM ${isStudent ? "users_student" : "users_company"}
                WHERE auth_uuid = $1;
            `;

        const query = type === UUIDType.User ? userQuery : authQuery;

        const result = await DBPool.query(query, [UUID]);

        const decryptedEmail = result.rows[0].email;
        return decryptedEmail ?? "";
    };

    /**
     * Get company name
     * @param UUID userUUID
     * @returns Company name
     */
    static async getCompany(
        UUID: UUID
    ): Promise<
        string
    > {
        const query = `
            SELECT company
            FROM users_company
            WHERE uuid = $1;
        `;

        const result = await DBPool.query(query, [UUID]);

        return decrypt(result.rows[0].company);
    };

    /**
     * Delete User and all its reference data
     * @param UUID userUUID
     * @param isStudent
    */
    static async delete(
        UUID: UUID,
        isStudent: boolean
    ): Promise<
        void
    > {
        const query = `
                DELETE FROM ${isStudent ? "users_student" : "users_company"}
                WHERE uuid = $1;
            `;

        await DBPool.query(query, [UUID]);
    }

   /**
     * Get all user UUIDs (students + companies)
     */
    static async getAllUsers(): Promise<UUID[]> {
        const query = `
            SELECT uuid FROM users_student
            UNION
            SELECT uuid FROM users_company
        `;

        const result = await DBPool.query(query);
        return result.rows.map(row => row.uuid);
    }
}