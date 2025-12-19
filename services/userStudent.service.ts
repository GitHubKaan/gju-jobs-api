import { UUID } from "crypto";
import { UserStudentType } from "../types/user.type";
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
    static async addStudent(
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
                    birthdate,
                    degree
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
            encrypt(payload.birthdate.trim()),
            payload.degree ? encrypt(payload.degree.trim()) : null,
        ]);

        if (result.rowCount === 0) {
            throw new DefaultError(
                StatusCodes.CONFLICT,
                MESSAGE.ERROR.DUPLICATE(TITLE.E_MAIL_ADDRESS)
            );
        }

        return { UUID, authUUID }
    };
}