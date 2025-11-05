import { StatusCodes } from "http-status-codes";
import { MESSAGE } from "../responseMessage";

/**
 * Normal error
 * @param statusCode Status Code
 * @param description Error description
 * @return statusCode; description; errorUUID?
 */
export class DefaultError extends Error {
    statusCode: number;
    description: string;

    constructor(statusCode: number, description: string) {
        super("default");
        this.statusCode = statusCode;
        this.description = description;
    }
}

/**
 * Validation error
 * @param description Error description
 * @param label Label (e. g. email, name etc.)
 * @return statusCode; description; label
 */
export class ValidationError extends Error {
    statusCode: number;
    description: string;
    label: string;

    constructor(description: string, label: string) {
        super("validation");
        this.statusCode = StatusCodes.BAD_REQUEST;
        this.description = description;
        this.label = label;
    }
}

/**
 * Cooldown error
 * @param remainingSeconds Remaining seconds until next request allowed
 * @return cooldownUntil
 */
export class CooldownError extends Error {
    statusCode: number;
    description: string;
    remainingSeconds: number;

    constructor(remainingSeconds: number) {
        super("cooldown");
        this.statusCode = StatusCodes.TOO_MANY_REQUESTS;
        this.description = MESSAGE.ERROR.TOO_MANY_REQUESTS;
        this.remainingSeconds = remainingSeconds;
    }
}

/**
 * Internal error
 * @param errorUUID ErrorUUID
 * @return statusCode; description; errorUUID?
 */
export class InternalError extends Error {
    statusCode: number;
    description: string;
    errorUUID: string;

    constructor(errorUUID: string) {
        super("internal");
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        this.description = MESSAGE.ERROR.INTERNAL_ERROR;
        this.errorUUID = errorUUID;
    }
}

export const allErrorTypes = [DefaultError, ValidationError, CooldownError, InternalError];
export const normalErrorTypes = [DefaultError, ValidationError, CooldownError];