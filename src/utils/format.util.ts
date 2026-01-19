import multer from "multer";
import path from "node:path";
import { ValidationError } from "./error.util";
import { ENV, fileTypes, getIndividualUserDataPath, imageTypes } from "./envReader.util";
import { MESSAGE } from "../../responseMessage";
import { UUID } from "node:crypto";
import { randomString } from "./stringGenerator.util";
import { FileType } from "../enums";

/**
 * Check client input format
 * @param value Input value
 * @param schema Zod schema
 * @param allOptional Should all values be optional? (Important for update purposes)
 * @throws {ValidationError}
 */
export function checkFormat(value: any, schema: any, allOptional?: boolean) {
    const schemaToUse = allOptional ? schema.partial() : schema;
    const result = schemaToUse.safeParse(value);

    if (result.success) { //Success
        return;
    }

    const errorMessage = result.error.errors[0].message;
    const path = result.error.errors[0].path[0];

    if (path && isNaN(path)) { //For errors with properties ("isNaN" is for a specific error -- like "fileTypeSchema")
        throw new ValidationError(
            `${path[0].toUpperCase()}${path.slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")} ${errorMessage}`, //Message
            path //Label
        );
    }

    throw new ValidationError( //For errors without properties
        `${errorMessage[0].toUpperCase()}${errorMessage.split(" ")[0].slice(1).replace(/([a-z])([A-Z])/g, "$1 $2")} ${errorMessage.split(" ").slice(1).join(" ")}`, //Message
        `${errorMessage.split(" ")[0]}` //Label
    );
}

/**
 * Multer picture upload format check
 * @param userUUID User UUID
 * @param fileSize File size
 * @param fileType File type
 * @returns Multer instance
 */
export const multerUploadCheck = (userUUID: UUID, fileSize: number, fileType: FileType) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req: any, file: any, cb: any) => {
                return cb(null, getIndividualUserDataPath(userUUID));
            },
            filename: (req: any, file: any, cb: any) => {
                const ext = path.extname(file.originalname).toLowerCase();
                const newFileName = `${randomString("A0", ENV.FILE_NAME_LENGTH)}${ext}`;
                return cb(null, newFileName);
            }
        }),
        limits: { fileSize: 1024 * 1024 * fileSize },
        fileFilter: (req: any, file: any, cb: any) => {
            if (fileType === FileType.ProfilePicture) {
                if (!imageTypes.includes(file.mimetype)) {
                    req.fileValidationError = new ValidationError(MESSAGE.ERROR.FILE_FORMAT, "file"); // Mark file as invalid
                    return cb(null, false);
                }
            } else if (fileType === FileType.CV) {
                if (!fileTypes.includes(file.mimetype)) {
                    req.fileValidationError = new ValidationError(MESSAGE.ERROR.FILE_FORMAT, "file"); // Mark file as invalid
                    return cb(null, false);
                }
            }
            
            return cb(null, true);
        }
    });
};

/**
 * Format to filename
 * @param input 
 * @returns Filename
*/
export function toFileName(input: string): string {
    return input
        .toLowerCase()                 // all lowercase
        .replace(/\s+/g, "_")          // Spaces to _
        .replace(/[^a-z0-9._-]/g, ""); // Remove unallowed symbols
}