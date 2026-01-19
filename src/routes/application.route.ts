import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { checkFormat } from "../utils/format.util";
import { Schemas } from "../utils/zod.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE, TITLE } from "../../responseMessage";
import { Apply } from "../types/application.type";

export class ApplicationRoute {
    /**
     * Apply for job (as a student)
     */
    static async handleApply(
        req: Request<any, any, Apply, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const payload: Apply = req.body;
        checkFormat(payload, Schemas.apply);

        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.SUCCESS(TITLE.APPLICATION),
            });
    }
}