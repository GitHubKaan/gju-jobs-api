export class FileQueries {
    public static readonly getUploadedAmount = `
        SELECT COUNT(*) AS total_entries
        FROM uploads
        WHERE user_uuid = $1
        AND type = $2;
    `;

    public static readonly add = `
        INSERT INTO uploads (
            user_uuid,
            uuid,
            name,
            type
        )
        VALUES ($1, $2, $3, $4);
    `;

    public static readonly getFiles = `
        SELECT
            uuid AS "UUID",
            name,
            type
        FROM uploads
        WHERE user_uuid = $1
        ORDER BY type;
    `;

    public static readonly getFile = `
        SELECT
            name,
            type
        FROM uploads
        WHERE uuid = $1
        AND user_uuid = $2;
    `;

    public static readonly hasPermission = `
        SELECT * 
        FROM uploads 
        WHERE user_uuid = $1
        AND uuid = $2;
    `;

    public static readonly getFilename = `
        SELECT name
        FROM uploads
        WHERE uuid = $1;
    `;

    public static readonly delete = `
        DELETE FROM uploads
        WHERE uuid = $1
        AND user_uuid = $2;
    `;

    public static readonly getProfilePicture = `
        SELECT *
        FROM uploads
        WHERE user_uuid = $1
        AND type = $2;
    `;
}