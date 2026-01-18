export class BlacklistQueries {
    public static readonly add = `
        INSERT INTO token_blacklist (token, expires)
        VALUES ($1, $2)
        ON CONFLICT (token) DO NOTHING;
    `;

    public static readonly isTokenBlacklisted = `
        SELECT *
        FROM token_blacklist
        WHERE token = $1;
    `

    public static readonly cleanupBlacklistedTokens = `
        DELETE FROM token_blacklist
        WHERE expires < NOW();
    `;
}