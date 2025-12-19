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
import { UserStudentType } from "../types/user.type";
import { sendSignupMail } from "../mail/templates/signup.mail";
import { Schemas } from "../utils/zod.util";
import { UserStudentService } from "../services/userStudent.service";
import { handleRequestCooldown } from "../utils/cooldown.util";
import { sendLoginMail } from "../mail/templates/login.mail";

export class UserStudent {
    /**
     * Signup
     * @param payload Signup
     */
    static async handleSignup(
        req: Request<any, any, UserStudentType, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const payload: UserStudentType = req.body;
        checkFormat(payload, Schemas.userStudent);

        const newUser = await UserStudentService.addStudent(payload);
        const authCode = await UserService.addAuthCode(newUser.UUID, true);
        createUserUploadFolder(newUser.UUID);

        // Seperate function needed for Tags, job pereferences and langauges

        sendSignupMail(payload.email, authCode);

        const token = Token.auth(newUser.UUID, newUser.authUUID, UserType.Student);

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