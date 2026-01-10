import { UUID } from "crypto";
import { UpdateUserStudentType, UserStudentType } from "../types/user.type";
import { PoolClient } from "pg";
import { DBPool } from "../configs/postgreSQL.config";
import { encrypt } from "../utils/encryption.util";
import { DefaultError } from "../utils/error.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE, TITLE } from "../responseMessage";
import { v4 as uuidv4 } from "uuid";

export class UserStudentService {
    /**
         * Add new student user
         * @param payload Signup payload
         * @returns UUID (userUUID) & authUUID
         * @throws {DefaultError} Already existing email
        */
    static async add(
        payload: UserStudentType,
    ): Promise<{
        UUID: UUID,
        authUUID: UUID
    }> {
        const client: PoolClient = await DBPool.connect();

        const query = `
                INSERT INTO users_student (
                    uuid,
                    auth_uuid,
                    email,
                    phone,
                    given_name,
                    surname,
                    degree,
                    program
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (email) DO NOTHING;
            `;

        const UUID: UUID = uuidv4() as UUID;
        const authUUID: UUID = uuidv4() as UUID;

        const result = await client.query(query, [
            UUID,
            authUUID,
            payload.email,
            payload.phone ? encrypt(payload.phone) : null,
            encrypt(payload.givenName.trim()),
            encrypt(payload.surname.trim()),
            payload.degree ? encrypt(payload.degree.trim()) : null,
            payload.program ? encrypt(payload.program.trim()) : null,
        ]);

        if (result.rowCount === 0) {
            throw new DefaultError(
                StatusCodes.CONFLICT,
                MESSAGE.ERROR.DUPLICATE(TITLE.E_MAIL_ADDRESS)
            );
        }

        return { UUID, authUUID }
    };

    /**
     * Update user data
     * @param UUID userUUID
     * @param payload UpdateUser
    */
    static async update(
        UUID: UUID,
        payload: UpdateUserStudentType
    ): Promise<
        void
    > {
        if (!payload) {
            throw new DefaultError(StatusCodes.NOT_MODIFIED, "No values provided to update.");
        }

        const fieldsToUpdate = {
            phone: payload.phone?.trimEnd().trimStart(),
            given_name: payload.givenName?.trimEnd().trimStart(),
            surname: payload.surname?.trimEnd().trimStart(),
            degree: payload.degree?.trimEnd().trimStart(),
            program: payload.program?.trimEnd().trimStart(),
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
            UPDATE users_student
            SET ${optionalClauses.join(", ")}
            WHERE uuid = $1;
        `;

        await DBPool.query(query, values);
    }
}