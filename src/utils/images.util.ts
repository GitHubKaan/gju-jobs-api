import path from "node:path";
import fs from "node:fs";
import mime from "mime";
import { Request, Response } from "express";
import { MESSAGE } from "../../responseMessage";
import { DefaultError } from "./error.util";
import { StatusCodes } from "http-status-codes";
import { userDataPath, imageTypes, fileTypes } from "./envReader.util";
import { getCurrentDateTime } from "./time.util";

export function uploadedFileHandler(req: Request, res: Response) {
    const filePath = userDataPath();
    fileHandler(filePath, req, res);
}

/**
 * Retrieve image
 * @returns Image
 */
function fileHandler(
    imagePath: string,
    req: Request,
    res: Response
) {
    const uploadPath = path.resolve(imagePath);
    const requestedPath = path.normalize(path.join(uploadPath, req.path));

    if (!mimeTypeCheck(uploadPath, requestedPath)) {
        return res.status(StatusCodes.FORBIDDEN).send({
            ...new DefaultError(StatusCodes.FORBIDDEN, MESSAGE.ERROR.FORBIDDEN),
            statusCode: undefined
        });
    }

    fs.stat(requestedPath, (error, stats) => {
        if (error || !stats.isFile()) {
            return res.status(404).sendFile(path.join(__dirname, "../../images", "not_found.png"));
            // .send({ description: MESSAGE.ERROR.NOT_FOUND("Image") });
        }

        res.setHeader("Cache-Control", 'public, max-age=31536000000, immutable'); // Cache for a very long time
        res.setHeader("Expires", new Date(getCurrentDateTime() + 1000 * 60 * 60 * 24 * 365).toUTCString()); // 1 years from now

        res.sendFile(requestedPath);
    });
}

/**
 * Mime type check
 * @param uploadPath
 * @param requestedPath
 * @param res
 */
function mimeTypeCheck(uploadPath: string, requestedPath: string) {
    // Check directory & Further file format check (so client wont get sensitive files in the worst case)
    const mimeType = mime.lookup(requestedPath);
    return requestedPath.startsWith(uploadPath) && (imageTypes.includes(mimeType || "") || fileTypes.includes(mimeType || ""));
}