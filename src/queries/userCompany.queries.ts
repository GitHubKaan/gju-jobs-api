export class UserCompanyQueries {
    public static readonly add = `
        INSERT INTO users_company (
            uuid,
            auth_uuid,
            email,
            phone,
            company,
            description,
            given_name,
            surname,
            street,
            street_number,
            zip_code,
            city,
            country,
            size,
            industry
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (email) DO NOTHING;
    `;

    public static readonly update = (values: string) => `
        UPDATE users_company
        SET ${values}
        WHERE uuid = $1;
    `;
}
