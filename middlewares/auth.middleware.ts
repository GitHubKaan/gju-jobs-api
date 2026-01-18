import { Response, Request, NextFunction } from "express";
import { TokenType, UserType } from "../enums";
import { authController } from "../utils/auth.util";
import { DefaultError } from "../utils/error.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE } from "../responseMessage";

/**
 * Authentication and authorization and environment payload adaptor
 * @param type Auth or recovery, access is default
 * @param groupRestriction Optional; Only for Student or Company accessible?
 * @returns None
 */
export const auth = (
    type: TokenType,
    groupRestriction?: UserType
) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = (req.headers.authentication || req.headers.authorization) as string; //Not that important
        
        const payload = await authController(token, type);
        const isStudent = payload.userType === UserType.Student;
        
        // Group Restriction checks
        if (
            groupRestriction === UserType.Company && isStudent ||
            groupRestriction === UserType.Student && !isStudent
        ) {
            throw new DefaultError(StatusCodes.UNAUTHORIZED, MESSAGE.ERROR.GROUP_PERMISSION);
        }

        req.token = token;
        req.tokenType = payload.type;
        req.tokenExp = payload.exp;
        req.userUUID = payload.userUUID;
        req.authUUID = payload.authUUID;
        req.userType = payload.userType;
        req.isStudent = isStudent;

        next(); //Success
    } catch(error: any) {
        next(error);
    }
};

export default auth;