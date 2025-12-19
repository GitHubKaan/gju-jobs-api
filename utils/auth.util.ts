import { UUID } from "crypto";
import { TokenType, UserType } from "../enums";
import { StatusCodes } from "http-status-codes";
import { DefaultError } from "./error.util";
import { MESSAGE, TITLE } from "../responseMessage";
import { Token } from "./token.util";
import { UserService } from "../services/user.service";
import { BlacklistService } from "../services/blacklist.service";
import { checkFormat } from "./format.util";
import { Schemas } from "./zod.util";

/**
 * Authentication/Authorization controller
 * @param token Token
 * @param type What type of token is required? (Auth or recovery, access is default)
 * @returns type; exp; userUUID; authUUID
 * @throws {DefaultError} Unauthorized
 */
export async function authController(
    token: string | undefined,
    type: TokenType
): Promise<{
    type: TokenType;
    exp: number;
    userUUID: UUID;
    authUUID: UUID;
    userType: UserType;
}> {
    try {
        if (!token) {
            throw new DefaultError(StatusCodes.UNAUTHORIZED, MESSAGE.ERROR.NOT_FOUND(TITLE.TOKEN));
        }
        checkFormat(token, Schemas.token);
        
        // const extractedToken = token.replace("Bearer ", "")
        const extractedToken = token.trim().replace(/^(Bearer\s+)+/i, ""); // Removes an infinite amount of "Bearer" infront of the Token -- Easier for Postman frontend team i guess...
        
        Token.verify(extractedToken, type);
        
        const payload = Token.getPayload(extractedToken);
        const isStudent = payload.userType === UserType.Student;
        
        await UserService.isValidAuthUUID(payload.authUUID, isStudent);
        await BlacklistService.isTokenBlacklisted(extractedToken);
        
        return {
            type: payload.type,
            exp: payload.exp,
            userUUID: payload.userUUID,
            authUUID: payload.authUUID,
            userType: payload.userType,
        };
    } catch (error: any) {
        throw new DefaultError(StatusCodes.UNAUTHORIZED, MESSAGE.ERROR.UNAUTHORIZED(TITLE.TOKEN));
    }
}