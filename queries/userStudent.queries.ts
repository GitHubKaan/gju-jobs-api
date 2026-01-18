export class UserStudentQueries {

    // SELECT QUERIES
    public static readonly selectStudentByUUID = `
        SELECT *
        FROM users_student
        WHERE uuid = $1;
    `;
    
    public static readonly selectTagByUser = `
        SELECT tag_id
        FROM users_student_tags
        WHERE user_uuid = $1;
    `;
    
    public static readonly selectJobPrefByUser = `
        SELECT preference_id
        FROM users_student_job_preferences
        WHERE user_uuid = $1;
    `;
    
    public static readonly selectLangByUser = `
        SELECT language_id
        FROM users_student_languages
        WHERE user_uuid = $1;
    `;
    
    // INSERT QUERIES
    public static readonly insertStudentQuery: string = `
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
    
    public static readonly insertTagQuery: string = `
        INSERT INTO users_student_tags (uuid,
                                        user_uuid,
                                        tag_id)
        VALUES ($1, $2, $3);
    `;
    
    public static readonly insertJobPrefQuery: string = `
        INSERT INTO users_student_job_preferences (uuid,
                                                   user_uuid,
                                                   preference_id)
        VALUES ($1, $2, $3);
    `;
    
    public static readonly insertLangQuery: string = `
        INSERT INTO users_student_languages (uuid,
                                             user_uuid,
                                             language_id)
        VALUES ($1, $2, $3);
    `;
    
    // DELETE QUERIES
    public static readonly deleteTagsByUserQuery = `
        DELETE FROM users_student_tags
        WHERE user_uuid = $1;
    `;
    
    public static readonly deleteJobPrefsByUserQuery = `
        DELETE FROM users_student_job_preferences
        WHERE user_uuid = $1;
    `;
    
    public static readonly deleteLangsByUserQuery = `
        DELETE FROM users_student_languages
        WHERE user_uuid = $1;
    `;
 
    public static readonly update = (values: string) => `
        UPDATE users_student
        SET ${values}
        WHERE uuid = $1;
    `;
}
