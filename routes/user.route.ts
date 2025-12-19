import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ParsedQs } from "qs";
import { checkFormat } from "../utils/format.util";
import { UserService } from "../services/user.service";
import { BlacklistService } from "../services/blacklist.service";
import { getDeviceInfo } from "../utils/userAgent.util";
import { NodeEnv, UUIDType } from "../enums";
import { sendAuthMail } from "../mail/templates/auth.mail";
import { Token } from "../utils/token.util";
import { MESSAGE, TITLE } from "../responseMessage";
import { createUserUploadFolder, deleteLocalUUIDFilepath } from "../utils/file.util";
import { sendDeleteUserMail } from "../mail/templates/deleteUser.mail";
import { sendGetDeleteUserMail } from "../mail/templates/getDeleteUser.mail";
import { ENV } from "../utils/envReader.util";
import { handleRequestCooldown } from "../utils/cooldown.util";
import { sendGetRecoveryMail } from "../mail/templates/getRecovery.mail";
import { sendLoginMail } from "../mail/templates/login.mail";
import { sendRecoveryMail } from "../mail/templates/recovery.mail";
import { UpdateUser, User } from "../types/user.type";
import { sendSignupMail } from "../mail/templates/signup.mail";
import { Schemas } from "../utils/zod.util";

/**
 * Signup
 * @param payload Signup
 */
export async function handleSignup(
    req: Request<any, any, User, ParsedQs, Record<string, any>>,
    res: Response
) {
    const payload: User = req.body;
    checkFormat(payload, Schemas.user);

    if (payload.isStudent) {
        // zod check student
    } else {
        // zod check company
        checkFormat(payload.company, Schemas.company);
    }
    
    const UUIDs = await UserService.addUser(payload, payload.isStudent);
    const authCode = await UserService.addAuthCode(UUIDs.UUID);
    createUserUploadFolder(UUIDs.UUID);
    
    // SEPERATE REQUEST NEEDED FOR TAGS; IF TAGS ADDED, EACH ELEMENT SHOULD BE ADDED SEPERATELY -- FUNCTION NEEDED -- FOR KAAN
    // SEPERATE REQUEST NEEDED FOR TAGS; IF TAGS ADDED, EACH ELEMENT SHOULD BE ADDED SEPERATELY -- FUNCTION NEEDED -- FOR KAAN
    // SEPERATE REQUEST NEEDED FOR TAGS; IF TAGS ADDED, EACH ELEMENT SHOULD BE ADDED SEPERATELY -- FUNCTION NEEDED -- FOR KAAN
    
    sendSignupMail(payload.email, authCode);

    const token = Token.auth(UUIDs.UUID, UUIDs.authUUID);

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
 * Login
 * @param email
 */
export async function handleLogin(
    req: Request<any, any, { email: string; }, ParsedQs, Record<string, any>>,
    res: Response
) {
    const { email } = req.body;
    checkFormat(email, Schemas.email);

    const UUIDs = await UserService.getUUIDs(email);
    await handleRequestCooldown(UUIDs.UUID);

    const authCode = await UserService.addAuthCode(UUIDs.UUID);
    sendLoginMail(email, authCode);

    const token = Token.auth(UUIDs.UUID, UUIDs.authUUID);

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
 * Authentication after login or signup
 * @param code
 * @returns Access token
 */
export async function handleAuth(
    req: Request<any, any, {
        code: string;
    }, ParsedQs, Record<string, any>>,
    res: Response
) {
    const { code } = req.body;
    checkFormat(code, Schemas.authCode);

    await UserService.hasRemainingAuthAttempts(req.userUUID);
    const isValid = await UserService.isValidAuthCode(req.userUUID, code);

    if (!isValid) {
        await UserService.addAuthAttempt(req.userUUID);
    }

    await BlacklistService.add(req.token, req.tokenExp);

    const email = await UserService.getEmail(req.userUUID, UUIDType.User);
    const deviceInfo = getDeviceInfo(req);
    sendAuthMail(email, deviceInfo.os, deviceInfo.browser);

    return res
        .status(StatusCodes.OK)
        .set("Authorization", `Bearer ${Token.access(req.userUUID, req.authUUID)}`)
        .json({ description: MESSAGE.SUCCESS(TITLE.AUTHENTICATION) });
}

/**
 * Authentication for user data deletion
 */
export async function handleGetDeleteUser(
    req: Request<any, void, void, ParsedQs, Record<string, any>>,
    res: Response
) {
    const token = Token.deletion(req.userUUID, req.authUUID);
    const email = await UserService.getEmail(req.userUUID, UUIDType.User);
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
export async function handleDeleteUser(
    req: Request<any, void, void, ParsedQs, Record<string, any>>,
    res: Response
) {
    await BlacklistService.add(req.token, req.tokenExp);

    const email = await UserService.getEmail(req.userUUID, UUIDType.User);
    sendDeleteUserMail(email);

    deleteLocalUUIDFilepath(req.userUUID);
    await UserService.delete(req.userUUID);

    return res
        .status(StatusCodes.OK)
        .json({ description: MESSAGE.DELETED(TITLE.USER) });
}

/**
 * Authentication for recovery
 * @param email
 */
export async function handleGetRecovery(
    req: Request<any, any, {
        email: string;
    }, ParsedQs, Record<string, any>>,
    res: Response
) {
    const { email } = req.body;
    checkFormat(email, Schemas.email);

    const UUIDs = await UserService.getUUIDs(email);
    await handleRequestCooldown(UUIDs.UUID);

    const token = Token.recovery(UUIDs.UUID, UUIDs.authUUID);
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
export async function handleRecovery(
    req: Request<any, void, void, ParsedQs, Record<string, any>>,
    res: Response
) {
    await BlacklistService.add(req.token, req.tokenExp);

    const newAuthUUID = await UserService.recover(req.authUUID);
    const email = await UserService.getEmail(newAuthUUID, UUIDType.Auth);

    sendRecoveryMail(email);

    return res
        .status(StatusCodes.OK)
        .json({ description: MESSAGE.SUCCESS(TITLE.RECOVERY) });
}

/**
 * Retrieve user data
 * @returns user
 */
export async function handleRetrieveUser(
    req: Request<any, any, any, ParsedQs, Record<string, any>>,
    res: Response
) {
    const user = await UserService.getUser(req.userUUID);

    return res
        .status(StatusCodes.OK)
        .json({
            description: MESSAGE.RETRIEVED(TITLE.USER),
            user: user
        });
}

/**
 * Update user data
 * @param payload UpdateUserPayload
 */
export async function handleUpdateUser(
    req: Request<any, any, UpdateUser, ParsedQs, Record<string, any>>,
    res: Response
) {
    const payload: UpdateUser = req.body;
    checkFormat(payload, Schemas.user, true);

    await UserService.update(req.userUUID, payload);

    // SEPERATE REQUEST NEEDED FOR TAGS; IF TAGS ADDED, EACH ELEMENT SHOULD BE ADDED SEPERATELY -- FUNCTION NEEDED -- FOR KAAN
    // SEPERATE REQUEST NEEDED FOR TAGS; IF TAGS ADDED, EACH ELEMENT SHOULD BE ADDED SEPERATELY -- FUNCTION NEEDED -- FOR KAAN
    // SEPERATE REQUEST NEEDED FOR TAGS; IF TAGS ADDED, EACH ELEMENT SHOULD BE ADDED SEPERATELY -- FUNCTION NEEDED -- FOR KAAN

    return res
        .status(StatusCodes.OK)
        .json({ description: MESSAGE.UPDATED(TITLE.USER) });
}