import {DBPool} from "../configs/postgreSQL.config";
import {v4 as uuidv4} from "uuid";
import {decrypt, encrypt} from "../utils/encryption.util";
import {DefaultError} from "../utils/error.util";
import {MESSAGE, TITLE} from "../responseMessage";
import {StatusCodes} from "http-status-codes";
import {ENV} from "../utils/envReader.util";
import {UUID} from "crypto";
import {UUIDType} from "../enums";
import {randomString} from "../utils/stringGenerator.util";
import {UpdateUser, User} from "../types/user.type";
import {hashValue} from "../utils/hash.util";
import {PoolClient} from "pg";

export class UserService {
    /**
     * Check if authUUID exists
     * @param authUUID
     * @throws {DefaultError} Unauthorized token
     */
    static async isValidAuthUUID(
        authUUID: UUID
    ): Promise<
        void
    > {
        let query = `
            SELECT 1
            FROM users
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
     * @returns UUID (userUUID) & authUUID
     * @throws {DefaultError} Email not found
     */
    static async getUUIDs(
        email: string
    ): Promise<{
        UUID: UUID,
        authUUID: UUID
    }> {
        const query = `
            SELECT
                uuid,
                auth_uuid
            FROM users
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
     * @returns Cooldown time or null
     */
    static async getCooldown(
        UUID: UUID
    ): Promise<
        string | null
    > {
        const query = `
            SELECT cooldown
            FROM users
            WHERE uuid = $1;
        `;
        
        const result = await DBPool.query(query, [UUID]);
            
        return result.rows[0].cooldown;
    };
    
    /**
     * Get user data
     * @param UUID userUUID
     * @returns User data
    */
    static async getUser(
        UUID: UUID
    ): Promise<
        any
    > {
        const query = `
            SELECT *
            FROM users
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
            company: decrypt(result.rows[0].company),
            street: decrypt(result.rows[0].street),
            streetNumber: decrypt(result.rows[0].street_number),
            ZIPCode: Number(decrypt(result.rows[0].zip_code)),
            city: decrypt(result.rows[0].city),
            country: decrypt(result.rows[0].country),
        }
    };
    
    /**
     * Set new cooldown time (automatically uses current time)
     * @param UUID userUUID
     */
    static async setCooldown(
        UUID: UUID
    ): Promise<
        void
    > {
        const query = `
            UPDATE users
            SET cooldown = NOW()
            WHERE uuid = $1;
        `;
        
        await DBPool.query(query, [UUID]);
    };
    
    /**
     * Add new user
     * @param payload Signup payload
     * @returns UUID (userUUID) & authUUID
     * @throws {DefaultError} Already existing email
    */
    static async addUser(
        payload: User
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
                payload.isStudent
            ]);

            if (result.rowCount === 0) {
                throw new DefaultError(
                    StatusCodes.CONFLICT,
                    MESSAGE.ERROR.DUPLICATE(TITLE.E_MAIL_ADDRESS)
                );
            }

            if (payload.isStudent) {
                await client.query(
                    `
                        INSERT INTO users_student (uuid, user_uuid)
                        VALUES ($1, $2)
                    `,
                    [uuidv4(), UUID]
                );
            } else {
                await client.query(
                    `
                        INSERT INTO users_company (uuid, user_uuid)
                        VALUES ($1, $2)
                    `,
                    [uuidv4(), UUID]
                );
            }

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
     * @returns New authUUID
     */
    static async recover(
        authUUID: UUID
    ): Promise<
        UUID
    > {
        const query = `
            UPDATE users
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
     * @return authCode
    */
    static async addAuthCode(
        UUID: UUID,
    ): Promise<
        string
    > {
        const query = `
            UPDATE users
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
     * @throws {DefaultError} Authentication attempts used up
     */
    static async hasRemainingAuthAttempts(
        UUID: UUID
    ): Promise<
        void
    > {
        const query = `
            SELECT *
            FROM users
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
     * @returns boolean
     */
    static async isValidAuthCode(
        UUID: UUID,
        authCode: string,
    ): Promise<
        boolean
    > {
        const query = `
            UPDATE users
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
     * @throws {DefaultError} Unauthorized authentication
     */
    static async addAuthAttempt(
        UUID: UUID,
    ): Promise<
        void
    > {
        const query = `
            UPDATE users
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
     * @returns Email
     */
    static async getEmail(
        UUID: UUID,
        type: UUIDType
    ): Promise<
        string
    > {
        const userQuery = `
            SELECT email
            FROM users 
            WHERE uuid = $1;
        `;
    
        const authQuery = `
            SELECT email
            FROM users 
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
        payload: UpdateUser
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
    */
    static async delete(
        UUID: UUID
    ): Promise<
        void
    > {
        const query = `
            DELETE FROM users
            WHERE uuid = $1;
        `;
    
        await DBPool.query(query, [UUID]);
    }

    /**
     * Get all user UUIDs
     * @returns All user UUIDs
     */
    static async getAllUsers(): Promise<
        UUID[]
    > {
        const query = `
            SELECT uuid
            FROM users
        `;

        const result = await DBPool.query(query);

        return result.rows.map((row) => row.uuid);
    }
}