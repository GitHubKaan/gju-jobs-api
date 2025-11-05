import { NextFunction, Request, Response } from "express";

/**
 * "Negative" response (Internal Errors, Unauthorized etc.) handler for routes
 * @param routeFunction
 */
export function routeWrapper(routeFunction: any): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await routeFunction(req, res, next);
        } catch (error: any) {
            next(error);
        }
    };
}