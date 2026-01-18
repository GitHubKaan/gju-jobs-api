import { RetrieveJobs } from "../types/jobs.type";

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

    public static readonly delete = `
        DELETE FROM jobs
        WHERE uuid = $1
        AND user_uuid = $2;
    `;

    public static readonly retrieve = `
        SELECT 
            j.uuid,
            j.user_uuid,
            j.title,
            j.description,
            j.position,
            j.exp,
            j.created,
            jt.tag_id,
            uc.uuid as company_uuid,
            uc.email,
            uc.company,
            uc.size,
            uc.industry,
            uc.country
        FROM jobs j
        LEFT OUTER JOIN jobs_tags jt ON j.uuid = jt.job_uuid
        INNER JOIN users_company uc ON j.user_uuid = uc.uuid
        WHERE (j.exp IS NULL OR j.exp > NOW())
    `;
}
