export class InternalErrorQueries {
    public static readonly create = `
        INSERT INTO internal_errors (uuid, backend, error)
        VALUES ($1, $2, $3);
    `;

    public static readonly isDuplicate = `
        SELECT uuid FROM internal_errors 
        WHERE error = $1
        LIMIT 1;
    `;
}