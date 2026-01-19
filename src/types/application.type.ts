import { UUID } from "node:crypto";

// Apply for job
interface BaseApply {
    jobUUID: UUID,
    message?: string,
};
export type Apply = BaseApply;