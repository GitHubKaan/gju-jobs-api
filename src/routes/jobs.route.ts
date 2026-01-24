import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { CreateJob, DeleteJob, RetrieveJobs, UpdateJob } from "../types/jobs.type";
import { checkFormat } from "../utils/format.util";
import { Schemas } from "../utils/zod.util";
import { JobsService } from "../services/jobs.service";
import { StatusCodes } from "http-status-codes";
import { MESSAGE, TITLE } from "../../responseMessage";

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
        const payload = req.body;
        checkFormat(payload, Schemas.job, true);
        checkFormat(payload.jobUUID, Schemas.UUID(TITLE.JOB));

        await JobsService.update(req.userUUID, payload);

        return res
            .status(StatusCodes.OK)
            .json({ description: MESSAGE.UPDATED(TITLE.JOB) });
    }

    /**
     * Delete Job
     */
    static async handleDelete(
        req: Request<any, any, DeleteJob, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const { jobUUID } = req.body;
        checkFormat(jobUUID, Schemas.UUID(TITLE.JOB));

        await JobsService.delete(req.userUUID, jobUUID);

        return res
            .status(StatusCodes.OK)
            .json({ description: MESSAGE.DELETED(TITLE.JOB) });
    }

    /**
     * Retrieve
     */
    static async handleRetrieve(
        req: Request<any, any, RetrieveJobs, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const payload = req.query;

        // Parse and validate query parameters
        const page = payload.page ? Number(payload.page as string) : 1;
        const pageSize = payload.pageSize ? Number(payload.pageSize as string) : 10;
        
        let tags: number[] | undefined;
        if (payload.tags) {
            tags = JSON.parse(payload.tags as string) as number[];
            checkFormat(tags, Schemas.tags);
        }

        payload.sort && checkFormat(payload.sort as string, Schemas.jobsSortType);
        checkFormat(page, Schemas.Number("page", 1, 10000)); // Min page 1
        checkFormat(pageSize, Schemas.Number("pageSize", 1, 100)); // Min 1, Max 100 elements per page

        const retrievePayload: RetrieveJobs = {
            tags,
            sort: payload.sort as any,
            page,
            pageSize,
        };

        const { jobs } = await JobsService.retrieve(retrievePayload);

        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.RETRIEVED(TITLE.JOBS),
                jobs: jobs
            });
    }

    /**
     * Retrieve Own jobs from company
     */
    static async handleRetrieveOwn(
        req: Request<any, any, any, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const { jobs } = await JobsService.retrieveOwn(req.userUUID);

        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.RETRIEVED(TITLE.JOBS),
                jobs: jobs
            });
    }
}