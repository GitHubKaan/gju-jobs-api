import { UUID } from "crypto";
import { UpdateUserStudentType, UserStudentType } from "../types/user.type";
import {PoolClient, QueryResult} from "pg";
import { DBPool } from "../configs/postgreSQL.config";
import { encrypt } from "../utils/encryption.util";
import { DefaultError } from "../utils/error.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE, TITLE } from "../responseMessage";
import { v4 as uuidv4 } from "uuid";
import { UserStudentQueries } from "../queries/userStudent.queries";

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

        // insert student
        const UUID: UUID = uuidv4() as UUID;
        const authUUID: UUID = uuidv4() as UUID;

        const result: QueryResult = await client.query(UserStudentQueries.INSERT_STUDENT_QUERY, [
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

        // insert tags
        if (payload.tags?.length) {
            for (const tagId of payload.tags) {
                await client.query(UserStudentQueries.INSERT_TAG_QUERY, [
                    uuidv4(),
                    UUID,
                    tagId
                ])
            }
        }

        // insert job preferences
        if (payload.jobPreferences?.length) {
            for (const prefId of payload.jobPreferences) {
                await client.query(UserStudentQueries.INSERT_JOB_PREF_QUERY, [
                    uuidv4(),
                    UUID,
                    prefId
                ])
            }
        }

        // insert languages
        if (payload.languages?.length) {
            for (const langId of payload.languages) {
                await client.query(UserStudentQueries.INSERT_LANG_QUERY, [
                    uuidv4(),
                    UUID,
                    langId
                ])
            }
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

        const client: PoolClient = await DBPool.connect();

        // update student
        const fieldsToUpdate = {
            phone: payload.phone?.trimEnd().trimStart(),
            given_name: payload.givenName?.trimEnd().trimStart(),
            surname: payload.surname?.trimEnd().trimStart(),
            degree: payload.degree?.trimEnd().trimStart(),
            program: payload.program?.trimEnd().trimStart(),
        };

        const optionalClauses: string[] = [];
        const values: any[] = [UUID]; //First value ($1) is User UUID

        Object.entries(fieldsToUpdate).forEach(([field, value]): void => {
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

        await client.query(query, values);

        // update tags only if "tags" is present in the payload
        if (payload.tags !== undefined) {
            // delete old tags
            await client.query(UserStudentQueries.DELETE_TAGS_BY_USER_QUERY, [UUID]);

            // add new tags (if any)
            if (payload.tags.length > 0) {
                for (const tagId of payload.tags) {
                    await client.query(UserStudentQueries.INSERT_TAG_QUERY, [
                        uuidv4(),
                        UUID,
                        tagId,
                    ]);
                }
            }
        }

        // update job preferences
        if (payload.jobPreferences !== undefined) {
            await client.query(UserStudentQueries.DELETE_JOB_PREFS_BY_USER_QUERY, [UUID]);

            if (payload.jobPreferences.length > 0) {
                for (const prefId of payload.jobPreferences) {
                    await client.query(UserStudentQueries.INSERT_JOB_PREF_QUERY, [
                        uuidv4(),
                        UUID,
                        prefId,
                    ]);
                }
            }
        }

        // update languages
        if (payload.languages !== undefined) {
            await client.query(UserStudentQueries.DELETE_LANGS_BY_USER_QUERY, [UUID]);

            if (payload.languages.length > 0) {
                for (const langId of payload.languages) {
                    await client.query(UserStudentQueries.INSERT_LANG_QUERY, [
                        uuidv4(),
                        UUID,
                        langId,
                    ]);
                }
            }
        }
    }
}