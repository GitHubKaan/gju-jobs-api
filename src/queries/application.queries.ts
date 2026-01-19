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
            student_uuid
        )
        VALUES ($1, $2, $3);
    `;
}