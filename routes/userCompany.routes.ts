import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ParsedQs } from "qs";
import { checkFormat } from "../utils/format.util";
import { UserService } from "../services/user.service";
import { NodeEnv, UserType } from "../enums";
import { Token } from "../utils/token.util";
import { MESSAGE } from "../responseMessage";
import { createUserUploadFolder } from "../utils/file.util";
import { ENV } from "../utils/envReader.util";
import { UserCompanyType } from "../types/user.type";
import { sendSignupMail } from "../mail/templates/signup.mail";
import { Schemas } from "../utils/zod.util";
import { UserCompanyService } from "../services/userCompany.service";

export class UserCompany {
    /**
     * Signup
     * @param payload Signup
     */
    static async handleSignup(
        req: Request<any, any, UserCompanyType, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const payload: UserCompanyType = req.body;
        checkFormat(payload, Schemas.userCompany);

        const newUser = await UserCompanyService.add(payload);
        const authCode = await UserService.addAuthCode(newUser.UUID, false);
        createUserUploadFolder(newUser.UUID);

        sendSignupMail(payload.email, authCode);

        const token = Token.auth(newUser.UUID, newUser.authUUID, UserType.Company);

        return res
            .status(StatusCodes.OK)
            .set("Authentication", `Bearer ${token.token}`)
            .json({
                description: MESSAGE.CONFIRMATION_EMAIL,
                expires: token.expires,

                ...((ENV.NODE_ENV === NodeEnv.Dev || ENV.NODE_ENV === NodeEnv.Testing) && { authCode: authCode })
            });
    }
}