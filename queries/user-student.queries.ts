// INSERT QUERIES
export const INSERT_STUDENT_QUERY: string = `
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

export const INSERT_TAG_QUERY: string = `
    INSERT INTO users_student_tags (uuid,
                                    user_uuid,
                                    tag_id)
    VALUES ($1, $2, $3);
`;

export const INSERT_JOB_PREF_QUERY: string = `
    INSERT INTO users_student_job_preferences (uuid,
                                               user_uuid,
                                               preference_id)
    VALUES ($1, $2, $3);
`;

export const INSERT_LANG_QUERY: string = `
    INSERT INTO users_student_languages (uuid,
                                         user_uuid,
                                         language_id)
    VALUES ($1, $2, $3);
`;

// DELETE QUERIES
export const DELETE_TAGS_BY_USER_QUERY = `
    DELETE FROM users_student_tags
    WHERE user_uuid = $1;
`;

export const DELETE_JOB_PREFS_BY_USER_QUERY = `
    DELETE FROM users_student_job_preferences
    WHERE user_uuid = $1;
`;

export const DELETE_LANGS_BY_USER_QUERY = `
    DELETE FROM users_student_languages
    WHERE user_uuid = $1;
`;
