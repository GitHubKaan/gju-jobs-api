import { rateLimit, RateLimitRequestHandler } from "express-rate-limit"
import { ENV } from "../utils/envReader.util";
import { CooldownError } from "../utils/error.util";

/**
 * Custom rate limit
 * @param windowMs Window in seconds
 * @param limit Request amount for time "window"
 * @returns Configured rateLimit
 */
export const rateLimiter = (windowMs: number, limit: number): RateLimitRequestHandler => {
    return rateLimit({
        windowMs: ENV.RATE_LIMIT ? windowMs * 1000 : 1000000,
        limit: ENV.RATE_LIMIT ? limit : 1000000,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next, options) => {
            const remainingSeconds = Number(res.getHeader("RateLimit-Reset"));

            const cooldownError = new CooldownError(remainingSeconds);
            const { statusCode, ...responseMessage } = cooldownError;
            res.status(statusCode).json(responseMessage);
        },
    });
};