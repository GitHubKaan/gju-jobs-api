import { ENV } from "../utils/envReader.util";

export class UserQueries {
    public static readonly isValidAuthUUID = (isStudent: boolean) => `
        SELECT 1
        FROM ${isStudent ? "users_student" : "users_company"}
        WHERE auth_uuid = $1
        LIMIT 1;
    `;

    public static readonly getUUIDs = (isStudent: boolean) => `
        SELECT
            uuid,
            auth_uuid
        FROM ${isStudent ? "users_student" : "users_company"}
        WHERE email = $1;
    `;

    public static readonly getCooldown = (isStudent: boolean) => `
        SELECT cooldown
        FROM ${isStudent ? "users_student" : "users_company"}
        WHERE uuid = $1;
    `;

    public static readonly getUser = `
        SELECT *
        FROM users_company
        WHERE uuid = $1
        LIMIT 1;
    `;

    public static readonly setCooldown = (isStudent: boolean) => `
        UPDATE ${isStudent ? "users_student" : "users_company"}
        SET cooldown = NOW()
        WHERE uuid = $1;
    `;

    public static readonly recover = (isStudent: boolean) => `
        UPDATE ${isStudent ? "users_student" : "users_company"}
        SET auth_uuid = $1
        WHERE auth_uuid = $2;
    `;

    public static readonly addAuthCode = (isStudent: boolean) => `
        UPDATE ${isStudent ? "users_student" : "users_company"}
        SET
            auth_code = $1,
            auth_code_created = NOW(),
            auth_code_attempt = 0
        WHERE uuid = $2;
    `;

    public static readonly hasRemainingAuthAttempts = (isStudent: boolean) => `
        SELECT *
        FROM ${isStudent ? "users_student" : "users_company"}
        WHERE uuid = $1
        AND auth_code_attempt < ${ENV.AUTH_MAX_ATTEMPTS}
        LIMIT 1;
    `;

    public static readonly isValidAuthCode = (isStudent: boolean) => `
        UPDATE ${isStudent ? "users_student" : "users_company"}
        SET
            auth_code = NULL,
            auth_code_attempt = 0,
            auth_code_created = NULL
        WHERE uuid = $1
        AND auth_code = $2
        AND auth_code_created > NOW() - INTERVAL '${ENV.AUTH_EXP} seconds';
    `;

    public static readonly addAuthAttempt = (isStudent: boolean) => `
        UPDATE ${isStudent ? "users_student" : "users_company"}
        SET auth_code_attempt = auth_code_attempt + 1
        WHERE uuid = $1;
    `;

    public static readonly getEmail = (isStudent: boolean, column: string) => `
        SELECT email
        FROM ${isStudent ? "users_student" : "users_company"} 
        WHERE ${column} = $1;
    `;

    public static readonly getCompany = `
        SELECT company
        FROM users_company
        WHERE uuid = $1;
    `;

    public static readonly delete = (isStudent: boolean) => `
        DELETE FROM ${isStudent ? "users_student" : "users_company"}
        WHERE uuid = $1;
    `;

    public static readonly getAllUsers = `
        SELECT uuid FROM users_student
        UNION
        SELECT uuid FROM users_company
    `;
}