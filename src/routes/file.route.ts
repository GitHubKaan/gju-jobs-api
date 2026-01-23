import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ParsedQs } from "qs";
import { UUID } from "node:crypto";
import { checkFormat, multerUploadCheck } from "../utils/format.util";
import { FileService } from "../services/file.service";
import { deleteLocalFile, imageUpload, pdfUpload } from "../utils/file.util";
import { MESSAGE, TITLE } from "../../responseMessage";
import { FileType } from "../enums";
import { ENV, getBackendOrigin, getFileURL } from "../utils/envReader.util";
import { Schemas } from "../utils/zod.util";

export class FileRoute {
    /**
     * Delete file
     * @param UUID
     */
    static async handleDeleteFile(
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
    static async handleRetrieveFiles(
        req: Request<any, any, any, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const files = await FileService.getFiles(req.userUUID);
        
        const modifFiles = files.map(file => ({
            ...file,
            url: getFileURL(req.userUUID, file.name)
        }));
        
        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.RETRIEVED(TITLE.FILES),
                files: modifFiles
            });
    }
    
    /**
     * Retrieve single file data
     * @param UUID File UUID
     * @return File
     */
    static async handleRetrieveFile(
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
            url: getFileURL(req.userUUID, file.name)
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
    static async handleUploadFile(
        req: Request<any, any, { type: FileType }, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const { type } = req.query;
        const fileType = type as FileType;
        checkFormat(type, Schemas.fileType);
    
        const userUUID = req.userUUID;
        
        // Get old filetype
        const fileInfo = await FileService.getSpecificFile(userUUID, fileType);

        let fileName: string = "";
        switch (type) {
            case FileType.ProfilePicture: {
                // Upload profile picture
                const multerInstance = multerUploadCheck(userUUID, ENV.PROFILE_PICTURE_MAX_SIZE, FileType.ProfilePicture);
                fileName = await imageUpload(res, req, multerInstance);
    
                // Delete old profile picture if available (needs to be down here after checks)
                if (fileInfo) {
                    await FileService.delete(fileInfo.UUID, userUUID);
                    deleteLocalFile(userUUID, fileInfo.name);
                }
                break;
            }
            case FileType.CV: {
                // Upload profile picture
                const multerInstance = multerUploadCheck(userUUID, ENV.CV_MAX_SIZE, FileType.CV);
                fileName = await pdfUpload(res, req, multerInstance);

                // Delete old CV if available (needs to be down here after checks)
                if (fileInfo) {
                    await FileService.delete(fileInfo.UUID, userUUID);
                    deleteLocalFile(userUUID, fileInfo.name);
                }
                break;
            }
            




            
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
}