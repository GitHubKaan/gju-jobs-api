import { Response, Request, NextFunction } from "express";
import { TokenType, UserType } from "../enums";
import { authController } from "../utils/auth.util";

/**
 * Authentication and authorization and environment payload adaptor
 * @param type Auth or recovery, access is default
 * @returns None
 */
export const auth = (
    type: TokenType
) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = (req.headers.authentication || req.headers.authorization) as string; //Not that important
        
        const payload = await authController(token, type);
        
        const isStudent = payload.userType === UserType.Student;
        
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