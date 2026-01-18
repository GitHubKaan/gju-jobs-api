export class JobsQueries {
    public static readonly add = `
        INSERT INTO jobs (
            uuid,
            user_uuid,
            title,
            description,
            position,
            exp
        )
        VALUES ($1, $2, $3, $4, $5, $6);
    `;

    public static readonly insertTags = `
        INSERT INTO jobs_tags (
            uuid,
            job_uuid,
            tag_id
        )
        VALUES ($1, $2, $3);
    `;

    public static readonly update = (values: string) => `
        UPDATE jobs
        SET ${values}
        WHERE user_uuid = $1
        AND uuid = $2;
    `;

    public static readonly deleteTagsByJob = `
        DELETE FROM jobs_tags
        WHERE job_uuid = $1;
    `;
}
