export class UserStudentQueries {

    // SELECT QUERIES
    public static readonly SELECT_STUDENT_BY_UUID = `
        SELECT *
        FROM users_student
        WHERE uuid = $1;
    `;
    
    public static readonly SELECT_TAG_BY_USER = `
        SELECT tag_id
        FROM users_student_tags
        WHERE user_uuid = $1;
    `;
    
    public static readonly SELECT_JOB_PREF_BY_USER = `
        SELECT preference_id
        FROM users_student_job_preferences
        WHERE user_uuid = $1;
    `;
    
    public static readonly SELECT_LANG_BY_USER = `
        SELECT language_id
        FROM users_student_languages
        WHERE user_uuid = $1;
    `;
    
    // INSERT QUERIES
    public static readonly INSERT_STUDENT_QUERY: string = `
        INSERT INTO users_student (uuid,
                                   auth_uuid,
                                   email,
                                   phone,
                                   given_name,
                                   surname,
                                   degree,
                                   program)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING;
    `;
    
    public static readonly INSERT_TAG_QUERY: string = `
        INSERT INTO users_student_tags (uuid,
                                        user_uuid,
                                        tag_id)
        VALUES ($1, $2, $3);
    `;
    
    public static readonly INSERT_JOB_PREF_QUERY: string = `
        INSERT INTO users_student_job_preferences (uuid,
                                                   user_uuid,
                                                   preference_id)
        VALUES ($1, $2, $3);
    `;
    
    public static readonly INSERT_LANG_QUERY: string = `
        INSERT INTO users_student_languages (uuid,
                                             user_uuid,
                                             language_id)
        VALUES ($1, $2, $3);
    `;
    
    // DELETE QUERIES
    public static readonly DELETE_TAGS_BY_USER_QUERY = `
        DELETE FROM users_student_tags
        WHERE user_uuid = $1;
    `;
    
    public static readonly DELETE_JOB_PREFS_BY_USER_QUERY = `
        DELETE FROM users_student_job_preferences
        WHERE user_uuid = $1;
    `;
    
    public static readonly DELETE_LANGS_BY_USER_QUERY = `
        DELETE FROM users_student_languages
        WHERE user_uuid = $1;
    `;
}
