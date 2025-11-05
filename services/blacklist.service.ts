import { DefaultError } from "../utils/error.util";
import { DBPool } from "../configs/postgreSQL.config";
import { StatusCodes } from "http-status-codes";
import { Token } from "../utils/token.util";
import { addInternalError } from "../utils/internalError.util";
import { MESSAGE, TITLE } from "../responseMessage";
import { hashValue } from "../utils/hash.util";

export class BlacklistService {
    /**
     * Add token to the blacklist
     * @param token
     */
    static async add(
        token: string,
        exp: number
    ): Promise<
        void
    > {
        const query = `
            INSERT INTO token_blacklist (token, expires)
            VALUES ($1, $2)
            ON CONFLICT (token) DO NOTHING;
        `;

        const hashedToken = hashValue(token);
        const result = await DBPool.query(query, [hashedToken, Token.expToTimestamp(exp)]);

        if (result.rowCount && result.rowCount > 0) { //Hashed-Token not blacklisted (...will be now)
            return;
        }

        throw new DefaultError(StatusCodes.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED(TITLE.TOKEN)); //Token already blacklisted
    };

    /**
     * Check if token is blacklisted
     * @param token
     * @returns GlobalResult or void
     */
    static async isTokenBlacklisted(
        token: string
    ): Promise<
        void
    > {
        const query = `
            SELECT *
            FROM token_blacklist
            WHERE token = $1;
        `

        const hashedToken = hashValue(token);
        const result = await DBPool.query(query, [hashedToken]);

        if (result.rowCount && result.rowCount > 0) {
            throw new DefaultError(StatusCodes.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED(TITLE.TOKEN));
        }
    };

    /**
     * Delete expired tokens
     */
    static async cleanupBlacklistedTokens() {
        const query = `
            DELETE FROM token_blacklist
            WHERE expires < NOW();
        `;

        DBPool.query(query, (error: any, result: any) => {
            if (error) {
                addInternalError(error, true, true);
            }

            // CONSOLE.LOG(`Expired values deleted from token blacklist (Total entries: ${result.rowCount}).`);
        });
    }
}