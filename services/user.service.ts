import { DBPool } from "../configs/postgreSQL.config";
import { v4 as uuidv4 } from "uuid";
import { decrypt, encrypt } from "../utils/encryption.util";
import { DefaultError } from "../utils/error.util";
import { MESSAGE, TITLE } from "../responseMessage";
import { StatusCodes } from "http-status-codes";
import { ENV } from "../utils/envReader.util";
import { UUID } from "crypto";
import { UUIDType } from "../enums";
import { randomString } from "../utils/stringGenerator.util";
import { UpdateUserCompanyType, UserCompanyType, UserStudentType } from "../types/user.type";
import { hashValue } from "../utils/hash.util";
import { PoolClient } from "pg";

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
        let query;
        if (isStudent) {
            query = `
                SELECT 1
                FROM users_student
                WHERE auth_uuid = $1
                LIMIT 1;
            `;
        } else {
            query = `
                SELECT 1
                FROM users_company
                WHERE auth_uuid = $1
                LIMIT 1;
            `;
        }

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
        let query;
        if (isStudent) {
            query = `
                SELECT
                    uuid,
                    auth_uuid
                FROM users_student
                WHERE email = $1;
            `;
        } else {
            query = `
                SELECT
                    uuid,
                    auth_uuid
                FROM users_company
                WHERE email = $1;
            `;
        }

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
        let query;
        if (isStudent) {
            query = `
                SELECT cooldown
                FROM users_student
                WHERE uuid = $1;
            `;
        } else {
            query = `
                SELECT cooldown
                FROM users_company
                WHERE uuid = $1;
            `;
        }

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
                birthdate: decrypt(result.rows[0].birthdate),
                degree: result.rows[0].degree ? decrypt(result.rows[0].degree) : null,
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
        let query;
        if (isStudent) {
            query = `
                UPDATE users_student
                SET cooldown = NOW()
                WHERE uuid = $1;
            `;
        } else {
            query = `
                UPDATE users_company
                SET cooldown = NOW()
                WHERE uuid = $1;
            `;
        }

        await DBPool.query(query, [UUID]);
    };



    /**
 * Add new student user
 * @param payload Signup payload
 * @returns UUID (userUUID) & authUUID
 * @throws {DefaultError} Already existing email
*/
    static async addCompany(
        payload: UserCompanyType,
    ): Promise<{
        UUID: UUID,
        authUUID: UUID
    }> {
        const client: PoolClient = await DBPool.connect();

        try {
            await client.query("BEGIN");

            const query = `
            INSERT INTO users (
                uuid,
                auth_uuid,
                email,
                given_name,
                surname,
                company,
                street,
                street_number,
                zip_code,
                city,
                country,
                phone,
                is_student
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT (email) DO NOTHING;
        `;

            const UUID: UUID = uuidv4() as UUID;
            const authUUID: UUID = uuidv4() as UUID;

            const result = await client.query(query, [
                UUID,
                authUUID,
                payload.email,
                encrypt(payload.givenName.trim()),
                encrypt(payload.surname.trim()),
                encrypt(payload.company.trim()),
                encrypt(payload.street.trim()),
                encrypt(payload.streetNumber.trim()),
                encrypt(payload.ZIPCode.toString()),
                encrypt(payload.city.trim()),
                encrypt(payload.country.trim()),
                payload.phone ? encrypt(payload.phone) : null,

            ]);

            if (result.rowCount === 0) {
                throw new DefaultError(
                    StatusCodes.CONFLICT,
                    MESSAGE.ERROR.DUPLICATE(TITLE.E_MAIL_ADDRESS)
                );
            }

            await client.query(
                `
                        INSERT INTO users_company (uuid, user_uuid)
                        VALUES ($1, $2)
                    `,
                [uuidv4(), UUID]
            );


            await client.query("COMMIT");

            return { UUID, authUUID };

        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
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
        let query;
        if (isStudent) {
            query = `
                UPDATE users_student
                SET auth_uuid = $1
                WHERE auth_uuid = $2;
            `;
        } else {
            query = `
                UPDATE users_company
                SET auth_uuid = $1
                WHERE auth_uuid = $2;
            `;
        }

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
        let query: string = "";
        if (isStudent) {
            query = `
                UPDATE users_student
                SET
                    auth_code = $1,
                    auth_code_created = NOW(),
                    auth_code_attempt = 0
                WHERE uuid = $2;
            `;
        } else {
            query = `
                UPDATE users_company
                SET
                    auth_code = $1,
                    auth_code_created = NOW(),
                    auth_code_attempt = 0
                WHERE uuid = $2;
            `;
        }

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
        let query;
        if (isStudent) {
            query = `
                SELECT *
                FROM users_student
                WHERE uuid = $1
                AND auth_code_attempt < ${ENV.AUTH_MAX_ATTEMPTS};
            `;
        } else {
            query = `
                SELECT *
                FROM users_company
                WHERE uuid = $1
                AND auth_code_attempt < ${ENV.AUTH_MAX_ATTEMPTS};
            `;
        }

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
        let query;
        if (isStudent) {
            query = `
                UPDATE users_student
                SET
                    auth_code = NULL,
                    auth_code_attempt = 0,
                    auth_code_created = NULL
                WHERE uuid = $1
                AND auth_code = $2
                AND auth_code_created > NOW() - INTERVAL '${ENV.AUTH_EXP} seconds';
            `;
        } else {
            query = `
                UPDATE users_company
                SET
                    auth_code = NULL,
                    auth_code_attempt = 0,
                    auth_code_created = NULL
                WHERE uuid = $1
                AND auth_code = $2
                AND auth_code_created > NOW() - INTERVAL '${ENV.AUTH_EXP} seconds';
            `;
        }

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
        let query;
        if (isStudent) {
            query = `
                UPDATE users_student
                SET auth_code_attempt = auth_code_attempt + 1
                WHERE uuid = $1;
            `;
        } else {
            query = `
                UPDATE users_company
                SET auth_code_attempt = auth_code_attempt + 1
                WHERE uuid = $1;
            `;
        }

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
        let userQuery;
        let authQuery;
        if (isStudent) {
            userQuery = `
                SELECT email
                FROM users_student 
                WHERE uuid = $1;
            `;

            authQuery = `
                SELECT email
                FROM users_student
                WHERE auth_uuid = $1;
            `;
        } else {
            userQuery = `
                SELECT email
                FROM users_company 
                WHERE uuid = $1;
            `;

            authQuery = `
                SELECT email
                FROM users_company
                WHERE auth_uuid = $1;
            `;
        }

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
            FROM users
            WHERE uuid = $1;
        `;

        const result = await DBPool.query(query, [UUID]);

        return decrypt(result.rows[0].company);
    };

    /**
     * Update user data
     * @param UUID userUUID
     * @param payload UpdateUser
    */
    static async update(
        UUID: UUID,
        payload: UpdateUserCompanyType
    ): Promise<
        void
    > {
        if (!payload) {
            throw new DefaultError(StatusCodes.NOT_MODIFIED, "No values provided to update.");
        }

        const fieldsToUpdate = {
            given_name: payload.givenName?.trimEnd().trimStart(),
            surname: payload.surname?.trimEnd().trimStart(),
            company: payload.company?.trimEnd().trimStart(),
            street: payload.street?.trimEnd().trimStart(),
            street_number: payload.streetNumber?.trimEnd().trimStart(),
            zip_code: payload.ZIPCode?.toString(),
            city: payload.city?.trimEnd().trimStart(),
            country: payload.country?.trimEnd().trimStart(),
            phone: payload.phone
        };

        const optionalClauses: string[] = [];
        const values: any[] = [UUID]; //First value ($1) is User UUID

        Object.entries(fieldsToUpdate).forEach(([field, value]) => {
            if (value) {
                optionalClauses.push(`${field} = $${optionalClauses.length + 2}`);
                values.push(encrypt(value));
            }
        });

        const query = `
            UPDATE users
            SET ${optionalClauses.join(", ")}
            WHERE uuid = $1;
        `;

        await DBPool.query(query, values);
    }

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
        let query;
        if (isStudent) {
            query = `
                DELETE FROM users_student
                WHERE uuid = $1;
            `;
        } else {
            query = `
                DELETE FROM users_company
                WHERE uuid = $1;
            `;
        }

        await DBPool.query(query, [UUID]);
    }

    /**
     * Get all user UUIDs
     * @returns All user UUIDs
     */
    static async getAllUsers(): Promise<UUID[]> {
        const query = `
            SELECT uuid FROM users
            UNION
            SELECT user_uuid AS uuid FROM users_student
            UNION
            SELECT user_uuid AS uuid FROM users_company
        `;

        const result = await DBPool.query(query);
        return result.rows.map(row => row.uuid);
    }

}