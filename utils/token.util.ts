import { UUID } from "crypto";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenType } from "../enums";
import { MESSAGE, TITLE } from "../responseMessage";
import { ENV, getFrontendOrigin } from "./envReader.util";
import { DefaultError, InternalError } from "./error.util";
import { getCurrentDateTime, toTimestamp } from "./time.util";

export class Token {
    /**
     * Create token link
     * @param token Token
     * @param type Token type
     * @returns Link
     */
    static link(token: string, type: TokenType): string {
        return `${getFrontendOrigin()}/${type}?token=${token}`;
    }

    /**
     * Create authentication token
     * @param userUUID User UUID
     * @param authUUID Auth UUID
     * @returns Token and exiration date
     */
    static auth(userUUID: UUID, authUUID: UUID): {token: string, expires: string} {
        const token = jwt.sign(
            {
                userUUID: userUUID,
                authUUID: authUUID,
                type: "auth",
            },
            ENV.AUTH_KEY,
            { 
                expiresIn: ENV.AUTH_EXP
            }
        );

        const expiresTime = getCurrentDateTime() + ENV.AUTH_EXP * 1000;
        const expires = toTimestamp(expiresTime);

        return {
            token: token,
            expires: expires
        }
    }

    /**
     * Create access token
     * @param userUUID User UUID
     * @param authUUID Auth UUID
     * @returns Access token
     */
    static access(userUUID: UUID, authUUID: UUID): string {
        return jwt.sign(
            {
                userUUID: userUUID,
                authUUID: authUUID,
                type: "access"
            },
            ENV.ACCESS_KEY,
            {
                expiresIn: ENV.ACCESS_EXP
            }
        );
    }

    /**
     * Create recovery token
     * @param userUUID User UUID
     * @param authUUID Auth UUID
     * @returns Recovery token
     */
    static recovery(userUUID: UUID, authUUID: UUID): string {
        return jwt.sign(
            {
                userUUID: userUUID,
                authUUID: authUUID,
                type: "recovery"
            },
            ENV.RECOVERY_KEY,
            {
                expiresIn: ENV.RECOVERY_EXP
            }
        );
    }

    /**
     * Create deletion token
     * @param userUUID User UUID
     * @param authUUID Auth UUID
     * @returns Deletion token
     */
    static deletion(userUUID: UUID, authUUID: UUID): string {
        return jwt.sign(
            {
                userUUID: userUUID,
                authUUID: authUUID,
                type: "deletion"
            },
            ENV.DELETION_KEY,
            {
                expiresIn: ENV.DELETION_EXP
            }
        );
    }

    /**
     * Verify JWT and get payload
     * @param token Token
     * @param type Token type
     */
    static verify(token: string, type: TokenType) {
        let key: string = "";
        switch(type) {
            case TokenType.Auth:
                key = ENV.AUTH_KEY;
                break;
            case TokenType.Access:
                key = ENV.ACCESS_KEY;
                break;
            case TokenType.Recovery:
                key = ENV.RECOVERY_KEY;
                break;
            case TokenType.Deletion:
                key = ENV.DELETION_KEY;
                break;
            default:
                throw new InternalError("Issue verifing Token, TokenType is missing."); //Should not be happening, everything defined inside Routes
        }
        
        try {
            jwt.verify(token, key) as JwtPayload;
        } catch (error: any) {
            throw new DefaultError(StatusCodes.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED(TITLE.TOKEN));
        }
    }

    /**
     * Get JWT payload
     * @param token Token
     * @returns JWT payload or DefaultError
     */
    static getPayload(token: string): any {
        const decoded = jwt.decode(token, { complete: true });
        
        if (!decoded) {
            throw new InternalError("Issue while retriving the Token Payload.");
        }
        
        return decoded.payload;
    }

    /**
     * Get expiration timestamp from token (token needs to be valid)
     * @param exp Token expiration time
     * @returns Timestamp (database format)
     */
    static expToTimestamp(exp: number) {
        const tokenExpires = exp;
        const tokenExpiresTimestamp = toTimestamp(tokenExpires * 1000, true);

        return tokenExpiresTimestamp;
    }
}