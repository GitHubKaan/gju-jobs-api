export class JobsQueries {
    public static readonly ADD = `
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

    public static readonly INSERT_TAGS = `
        INSERT INTO jobs_tags (
            uuid,
            job_uuid,
            tag_id
        )
        VALUES ($1, $2, $3);
    `;
}
