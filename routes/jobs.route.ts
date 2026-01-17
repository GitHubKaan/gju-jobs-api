import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { CreateJob, DeleteJob, UpdateJob } from "../types/jobs.type";
import { checkFormat } from "../utils/format.util";
import { Schemas } from "../utils/zod.util";
import { JobsService } from "../services/jobs.service";
import { StatusCodes } from "http-status-codes";
import { MESSAGE, TITLE } from "../responseMessage";

export class JobsRoute {
    /**
     * Create Job
     */
    static async handleCreate(
        req: Request<any, any, CreateJob, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const payload: CreateJob = req.body;
        checkFormat(payload, Schemas.job);

        const jobUUID = await JobsService.add(req.userUUID, payload);

        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.ADDED(TITLE.JOB),
                uuid: jobUUID
            });
    }

    /**
     * Update Job
     */
    static async handleUpdate(
        req: Request<any, any, UpdateJob, ParsedQs, Record<string, any>>,
        res: Response
    ) {

    }

    /**
     * Delete Job
     */
    static async handleDelete(
        req: Request<any, any, DeleteJob, ParsedQs, Record<string, any>>,
        res: Response
    ) {

    }

    /**
     * Retrieve
     */
    static async handleRetrieve(
        req: Request<any, any, any, ParsedQs, Record<string, any>>,
        res: Response
    ) {

    }
}