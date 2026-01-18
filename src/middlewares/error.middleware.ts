import { Request, Response, NextFunction } from 'express';
import { DefaultError, InternalError, normalErrorTypes } from '../utils/error.util';
import { MESSAGE, TITLE } from "../../responseMessage";
import { StatusCodes } from "http-status-codes";
import { addInternalError } from '../utils/internalError.util';

/**
 * Middleware that handles multiple types of client errors (HTTP)
 * @param error Error
 * @param req Client Request
 * @param res Client Response
 * @param next Next function
 * @returns Response message
 */
export const errorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {
    if (normalErrorTypes.find(type => error instanceof type)) {
        return res.status(error.statusCode).json({ ...error, statusCode: undefined });
    }

    if (error instanceof SyntaxError) { //Catching syntax based errors inside request
        return res.status(StatusCodes.BAD_REQUEST).json({ ...new DefaultError(StatusCodes.BAD_REQUEST, MESSAGE.ERROR.FAULTY), statusCode: undefined });
    }
    
    if (error.message === "request entity too large") {
        return res.status(StatusCodes.BAD_REQUEST).json({ ...new DefaultError(StatusCodes.REQUEST_TOO_LONG, MESSAGE.ERROR.TOO_LARGE), statusCode: undefined });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ...new InternalError(await addInternalError(error, true, true)), statusCode: undefined });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    return res.status(StatusCodes.NOT_FOUND).json({ description: MESSAGE.ERROR.NOT_FOUND(TITLE.PATH) });
};