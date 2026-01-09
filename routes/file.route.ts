import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ParsedQs } from "qs";
import { UUID } from "crypto";
import { checkFormat, multerUploadCheck } from "../utils/format.util";
import { FileService } from "../services/file.service";
import { deleteLocalFile, fileUpload } from "../utils/file.util";
import { MESSAGE, TITLE } from "../responseMessage";
import { FileType } from "../enums";
import { ENV, getBackendOrigin } from "../utils/envReader.util";
import { Schemas } from "../utils/zod.util";

/**
 * Delete file
 * @param UUID
 */
export async function handleDeleteFile(
    req: Request<any, any, { UUID: UUID }, ParsedQs, Record<string, any>>,
    res: Response
) {
    const { UUID } = req.body;
    checkFormat(UUID, Schemas.UUID("file"));
    
    const userUUID = req.userUUID;
    const fileName = await FileService.getFilename(UUID);

    await FileService.delete(UUID, userUUID);
    deleteLocalFile(userUUID, fileName);

    return res
        .status(StatusCodes.OK)
        .json({ description: MESSAGE.DELETED(TITLE.FILE) });
}

/**
 * Retrieve file data
 * @return Files
 */
export async function handleRetrieveFiles(
    req: Request<any, any, any, ParsedQs, Record<string, any>>,
    res: Response
) {
    const files = await FileService.getFiles(req.userUUID);
    
    return res
        .status(StatusCodes.OK)
        .json({
            description: MESSAGE.RETRIEVED(TITLE.FILES),
            files: files
        });
}

/**
 * Retrieve single file data
 * @param UUID File UUID
 * @return File
 */
export async function handleRetrieveFile(
    req: Request<any, any, {
        UUID: UUID
    }, ParsedQs, Record<string, any>>,
    res: Response
) {
    const UUID = req.query.UUID as UUID;
    checkFormat(UUID, Schemas.UUID("file"));

    const file = await FileService.getFile(UUID, req.userUUID);
    
    const modifFile = {
        ...file,
        url: `${getBackendOrigin()}/${ENV.IMAGE_UPLOAD_PATH}/${req.userUUID}/${file.name}`
    };

    return res
        .status(StatusCodes.OK)
        .json({
            description: MESSAGE.RETRIEVED(TITLE.FILE),
            file: modifFile
        });
}

/**
 * Upload file
 * @param type
 * @param file Inside body (form-data)
 */
export async function handleUploadFile(
    req: Request<any, any, { type: FileType }, ParsedQs, Record<string, any>>,
    res: Response
) {
    const { type } = req.query;
    const fileType = type as FileType;
    checkFormat(type, Schemas.fileType);

    const userUUID = req.userUUID;
    
    let fileName: string = "";
    switch (type) {
        case FileType.ProfilePicture: {
            // Get old profile picture
            const PPFile = await FileService.getProfilePicture(userUUID);

            // Upload profile picture
            const multerInstance = multerUploadCheck(userUUID, ENV.PROFILE_PICTURE_MAX_SIZE);
            fileName = await fileUpload(res, req, multerInstance);

            // Delete old profile picture if available (needs to be down here after checks)
            if (PPFile) {
                await FileService.delete(PPFile.UUID, userUUID);
                deleteLocalFile(userUUID, PPFile.name);
            }
            break;
        }

        /* ADD FURTHER UPLOADS HERE */

        default:
            break;
    }

    const UUID = await FileService.add(userUUID, fileName, fileType);

    return res
        .status(StatusCodes.OK)
        .json({
            description: MESSAGE.UPLOADED(TITLE.FILE),
            UUID: UUID,
            fileName: fileName
        });
}