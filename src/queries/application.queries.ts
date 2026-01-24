export class ApplicationQueries {
    public static readonly exists = `
        SELECT *
        FROM applications
        WHERE job_uuid = $1
        AND student_uuid = $2
        LIMIT 1;
    `;

    public static readonly add = `
        INSERT INTO applications (
            uuid,
            job_uuid,
            student_uuid,
            message
        )
        VALUES ($1, $2, $3, $4);
    `;

    public static readonly getApplicantsByJob = `
        SELECT
            s.uuid,
            s.email,
            s.phone,
            s.given_name,
            s.surname,
            s.degree,
            s.program,
            t.tag_id AS student_tag_id,
            jp.preference_id AS student_job_preference,
            l.language_id AS student_language,
            u.name AS cv_name,
            a.message
        FROM applications a
        INNER JOIN users_student s ON a.student_uuid = s.uuid
        LEFT JOIN users_student_tags t ON s.uuid = t.user_uuid
        LEFT JOIN users_student_job_preferences jp ON s.uuid = jp.user_uuid
        LEFT JOIN users_student_languages l ON s.uuid = l.user_uuid
        LEFT JOIN uploads u ON s.uuid = u.user_uuid
        AND u.type = 'CV'
        WHERE a.job_uuid = $1;
    `;

    public static readonly getApplicationsByStudent = `
    SELECT 
        j.uuid,
        j.user_uuid,
        j.title,
        j.description,
        j.location,
        j.position,
        j.exp,
        j.created,
        jt.tag_id,
        uc.uuid AS company_uuid,
        uc.email,
        uc.company,
        uc.size,
        uc.industry,
        uc.country,
        a.message
    FROM applications a
    INNER JOIN jobs j ON a.job_uuid = j.uuid
    LEFT OUTER JOIN jobs_tags jt ON j.uuid = jt.job_uuid
    INNER JOIN users_company uc ON j.user_uuid = uc.uuid
    WHERE a.student_uuid = $1
    AND (j.exp IS NULL OR j.exp > NOW());
`;
}