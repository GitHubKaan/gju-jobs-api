import { UUID } from "node:crypto";
import { JobsSortType } from "../enums";

// Create Job
interface BaseCreateJob {
    title: string,
    description: string,
    tags: number[],
    position: string,
    exp?: number,
};
export type CreateJob = BaseCreateJob;

// Update Job
export type UpdateJob = Partial<BaseCreateJob> & {
    jobUUID: UUID;
};

// Delete Job
interface BaseDeleteJob {
    jobUUID: UUID, // job UUID
};
export type DeleteJob = BaseDeleteJob;

// Retrieve
interface BaseRetrieveJobs {
    tags?: number[], // finding best match for the tags
    sort?: JobsSortType // Sorting
    page: number, // what page?
    pageSize: number, // what page size (how many elements?)
};
export type RetrieveJobs = BaseRetrieveJobs;