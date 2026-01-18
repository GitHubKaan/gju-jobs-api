import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ParsedQs } from "qs";
import { checkFormat } from "../utils/format.util";
import { UserService } from "../services/user.service";
import { BlacklistService } from "../services/blacklist.service";
import { getDeviceInfo } from "../utils/userAgent.util";
import { NodeEnv, UserType, UUIDType } from "../enums";
import { sendAuthMail } from "../mail/templates/auth.mail";
import { Token } from "../utils/token.util";
import { MESSAGE, TITLE } from "../../responseMessage";
import { deleteLocalUUIDFilepath } from "../utils/file.util";
import { sendDeleteUserMail } from "../mail/templates/deleteUser.mail";
import { sendGetDeleteUserMail } from "../mail/templates/getDeleteUser.mail";
import { ENV } from "../utils/envReader.util";
import { handleRequestCooldown } from "../utils/cooldown.util";
import { sendGetRecoveryMail } from "../mail/templates/getRecovery.mail";
import { sendLoginMail } from "../mail/templates/login.mail";
import { sendRecoveryMail } from "../mail/templates/recovery.mail";
import { UpdateUserCompanyType, UpdateUserStudentType } from "../types/user.type";
import { Schemas } from "../utils/zod.util";
import { UserStudentService } from "../services/userStudent.service";
import { UserCompanyService } from "../services/userCompany.service";

export class UserRoute {
    /**
     * Authentication after login or signup
     * @param code
     * @returns Access token
     */
    static async handleAuth(
        req: Request<any, any, {
            code: string;
        }, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const { code } = req.body;
        checkFormat(code, Schemas.authCode);
    
        await UserService.hasRemainingAuthAttempts(req.userUUID, req.isStudent);
        const isValid: boolean = await UserService.isValidAuthCode(req.userUUID, code, req.isStudent);
    
        if (!isValid) {
            await UserService.addAuthAttempt(req.userUUID, req.isStudent);
        }
    
        await BlacklistService.add(req.token, req.tokenExp);
    
        const email: string = await UserService.getEmail(req.userUUID, UUIDType.User, req.isStudent);
        const deviceInfo = getDeviceInfo(req);
        sendAuthMail(email, deviceInfo.os, deviceInfo.browser);
    
        const accessToken: string = Token.access(req.userUUID, req.authUUID, req.isStudent ? UserType.Student : UserType.Company);
    
        return res
            .status(StatusCodes.OK)
            .set("Authorization", `Bearer ${accessToken}`)
            .json({ description: MESSAGE.SUCCESS(TITLE.AUTHENTICATION) });
    }
    
    /**
     * Login
     * @param email
    */
    static async handleLogin(
        req: Request<any, any, {
            email: string;
            isStudent: boolean;
        }, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const { email, isStudent } = req.body;
        checkFormat(email, Schemas.email);
        checkFormat(isStudent, Schemas.boolean);
    
        const UUIDs = await UserService.getUUIDs(email, isStudent);
        await handleRequestCooldown(UUIDs.UUID, isStudent);
    
        const authCode: string = await UserService.addAuthCode(UUIDs.UUID, isStudent);
        sendLoginMail(email, authCode);
    
        const token = Token.auth(UUIDs.UUID, UUIDs.authUUID, isStudent ? UserType.Student : UserType.Company);
    
        return res
            .status(StatusCodes.OK)
            .set("Authentication", `Bearer ${token.token}`)
            .json({
                description: MESSAGE.CONFIRMATION_EMAIL,
                expires: token.expires,
    
                ...((ENV.NODE_ENV === NodeEnv.Dev || ENV.NODE_ENV === NodeEnv.Testing) && { authCode: authCode })
            });
    }
    
    /**
     * Update user data
     * @param payload UpdateUserPayload
     */
    static async handleUpdateUser(
        req: Request<any, any, UpdateUserStudentType | UpdateUserCompanyType, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const payload = req.body;

        if (req.isStudent) {
            checkFormat(payload, Schemas.userStudent, true);
            await UserStudentService.update(req.userUUID, payload);
        } else {
            checkFormat(payload, Schemas.userCompany, true);
            await UserCompanyService.update(req.userUUID, payload);
        }
        
        return res
            .status(StatusCodes.OK)
            .json({ description: MESSAGE.UPDATED(TITLE.USER) });
    }
    
    /**
     * Retrieve user data
     * @returns user
     */
    static async handleRetrieveUser(
        req: Request<any, any, any, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const user = await UserService.getUser(req.userUUID, req.isStudent);
    
        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.RETRIEVED(TITLE.USER),
                user: user
            });
    }
    
    /**
     * Authentication for recovery
     * @param email
     */
    static async handleGetRecovery(
        req: Request<any, any, {
            email: string;
            isStudent: boolean;
        }, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const { email, isStudent } = req.body;
        checkFormat(email, Schemas.email);
        checkFormat(isStudent, Schemas.boolean);
    
        const UUIDs = await UserService.getUUIDs(email, isStudent);
        await handleRequestCooldown(UUIDs.UUID, isStudent);
    
        const token: string = Token.recovery(UUIDs.UUID, UUIDs.authUUID, isStudent ? UserType.Student : UserType.Company);
        sendGetRecoveryMail(email, token);
    
        if (ENV.NODE_ENV === NodeEnv.Dev || ENV.NODE_ENV === NodeEnv.Testing) {
            res.set("Authentication", `Bearer ${token}`);
        }
    
        return res
            .status(StatusCodes.OK)
            .json({ description: MESSAGE.CONFIRMATION_EMAIL });
    }
    
    /**
     * Recover account
     */
    static async handleRecovery(
        req: Request<any, void, void, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        await BlacklistService.add(req.token, req.tokenExp);
    
        const newAuthUUID = await UserService.recover(req.authUUID, req.isStudent);
        const email: string = await UserService.getEmail(newAuthUUID, UUIDType.Auth, req.isStudent);
    
        sendRecoveryMail(email);
    
        return res
            .status(StatusCodes.OK)
            .json({ description: MESSAGE.SUCCESS(TITLE.RECOVERY) });
    }
    
    /**
     * Authentication for user data deletion
     */
    static async handleGetDeleteUser(
        req: Request<any, void, void, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const token: string = Token.deletion(req.userUUID, req.authUUID, req.isStudent ? UserType.Student : UserType.Company);
        const email: string = await UserService.getEmail(req.userUUID, UUIDType.User, req.isStudent);
        sendGetDeleteUserMail(email, token);
    
        if (ENV.NODE_ENV === NodeEnv.Dev || ENV.NODE_ENV === NodeEnv.Testing) {
            res.set("Authentication", `Bearer ${token}`);
        }
    
        return res
            .status(StatusCodes.OK)
            .json({ description: MESSAGE.CONFIRMATION_EMAIL });
    }
    
    /**
     * Delete user and all its data
     */
    static async handleDeleteUser(
        req: Request<any, void, void, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        await BlacklistService.add(req.token, req.tokenExp);
    
        const email: string = await UserService.getEmail(req.userUUID, UUIDType.User, req.isStudent);
        sendDeleteUserMail(email);
    
        deleteLocalUUIDFilepath(req.userUUID);
        await UserService.delete(req.userUUID, req.isStudent);
    
        return res
            .status(StatusCodes.OK)
            .json({ description: MESSAGE.DELETED(TITLE.USER) });
    }
}