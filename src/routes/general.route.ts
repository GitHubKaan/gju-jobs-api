import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { StatusCodes } from "http-status-codes";
import { checkFormat } from "../utils/format.util";
import { Support } from "../types/support.type";
import { MESSAGE, TITLE } from "../../responseMessage";
import { sendCustomerServiceSupportMail, sendSupportMail } from "../mail/templates/support.mail";
import { randomString } from "../utils/stringGenerator.util";
import { addInternalError } from "../utils/internalError.util";
import { Schemas } from "../utils/zod.util";

export class GeneralRoute {
    /**
     * Add support request
     * @param email
     * @param phone Optional
     * @param type Support type
     * @param message
     */
    static async handleSupport(
        req: Request<any, any, Support, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const payload: Support = req.body;
        checkFormat(payload, Schemas.support);
        
        const caseNumber = randomString("0", 10);
        sendCustomerServiceSupportMail(payload, caseNumber);
        sendSupportMail(payload.email, caseNumber);
    
        return res
            .status(StatusCodes.OK)
            .json({ description: MESSAGE.SUBMITTED(TITLE.SUPPORT_REQUEST) });
    }
    
    /**
     * User has encountered frontend error -- will be sent to this endpoint
     * @param errorMessage
     */
    static async handleSendFrontendError(
        req: Request<any, any, { errorMessage: string }, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const errorMessage: string = req.body.errorMessage;
        checkFormat(errorMessage, Schemas.frontendError);
    
        const errorUUID = await addInternalError(errorMessage, false, false);
    
        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.SUBMITTED(TITLE.ERROR),
                errorUUID: errorUUID
            });
    }
}