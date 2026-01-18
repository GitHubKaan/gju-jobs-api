import { UUID } from "node:crypto";

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
    uuid: UUID, // job UUID
};
export type DeleteJob = BaseDeleteJob;
