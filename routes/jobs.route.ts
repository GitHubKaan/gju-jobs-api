import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { CreateJob, DeleteJob, UpdateJob } from "../types/jobs.type";

export class JobsRoute {
    /**
     * Create Job
     */
    static async handleCreate(
        req: Request<any, any, CreateJob, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        
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