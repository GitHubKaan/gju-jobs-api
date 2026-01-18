import { DefaultError } from "../utils/error.util";
import { MESSAGE, TITLE } from "../responseMessage";
import { v4 as uuidv4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import { FileType } from "../enums";
import { DBPool } from "../configs/postgreSQL.config";
import { UUID } from "crypto";
import { File } from "../types/file.type";
import { FileQueries } from "../queries/file.queries";

export class FileService {
    /**
     * Get uploaded file amount for certain file type
     * @param userUUID
     * @param type
     * @return Total entries
     */
    static async getUploadedAmount(
        userUUID: UUID,
        type: FileType
    ): Promise<
        number
    > {
        const result = await DBPool.query(FileQueries.getUploadedAmount, [userUUID, type]);

        return result.rows[0].total_entries;
    };
    
    /**
     * Add file reference
     * @param userUUID
     * @param fileName
     * @param type
     * @returns File UUID
    */
    static async add(
        userUUID: UUID,
        fileName: string,
        type: FileType
    ): Promise<
        UUID
    > {
        const fileUUID = uuidv4() as UUID;
        await DBPool.query(FileQueries.add, [userUUID, fileUUID, fileName, type]);

        return fileUUID;
    };
    
    /**
     * Retrieve all files
     * @param userUUID
     * @returns Files
     * @throws {DefaultError} File not found
    */
    static async getFiles(
        userUUID: UUID
    ): Promise<
        File[]
    > {
        const result = await DBPool.query(FileQueries.getFiles, [userUUID]);

        if (result.rowCount && result.rowCount > 0) {
            return result.rows as File[];
        }
        
        throw new DefaultError(StatusCodes.NOT_FOUND, MESSAGE.ERROR.NOT_FOUND(TITLE.FILES));
    };

    /**
     * Retrieve single file
     * @param UUID File UUID
     * @param userUUID
     * @returns File
     * @throws {DefaultError} File not found
    */
    static async getFile(
        UUID: UUID,
        userUUID: UUID
    ): Promise<
        File
    > {
        const result = await DBPool.query(FileQueries.getFile, [UUID, userUUID]);

        if (result.rowCount && result.rowCount > 0) {
            return result.rows[0];
        }
        
        throw new DefaultError(StatusCodes.NOT_FOUND, MESSAGE.ERROR.NOT_FOUND(TITLE.FILE));
    };
    
    /**
     * Check if user has permission to use file
     * @param UUID
     * @param userUUID
     * @throws {DefaultError} File not found
    */
    static async hasPermission(
        UUID: UUID,
        userUUID: UUID
    ): Promise<
        void
    > {
        const result = await DBPool.query(FileQueries.hasPermission, [userUUID, UUID]);

        if (result.rowCount && result.rowCount > 0) {
            return;
        }

        throw new DefaultError(StatusCodes.BAD_REQUEST, MESSAGE.ERROR.NOT_FOUND(TITLE.FILE));
    };
    
    /**
     * Get filename by fileUUID
     * @param UUID
     * @returns Filename
     */
    static async getFilename(
        UUID: UUID
    ): Promise<
        string
    > {
        const result = await DBPool.query(FileQueries.getFilename, [UUID]);
        
        if (result.rowCount && result.rowCount > 0) {
            return result.rows[0].name;
        }

        throw new DefaultError(StatusCodes.BAD_REQUEST, MESSAGE.ERROR.NOT_FOUND(TITLE.FILE));
    };

    /**
     * Delete file reference
     * @param UUID
     * @param userUUID
     * @return void
     * @throws {DefaultError} File not found
     */
    static async delete(
        UUID: UUID,
        userUUID: UUID
    ): Promise<
        void
    > {
        const result = await DBPool.query(FileQueries.delete, [UUID, userUUID]);

        if (result.rowCount && result.rowCount > 0) {
            return;
        }

        throw new DefaultError(StatusCodes.BAD_REQUEST, MESSAGE.ERROR.NOT_FOUND(TITLE.FILE));
    };
    
    /**
     * Get profile picture name from userUUID
     * @param userUUID
     * @returns Profile picture data
     */
    static async getProfilePicture(
        userUUID: UUID
    ): Promise<
        File | undefined
    > {
        const result = await DBPool.query(FileQueries.getProfilePicture, [userUUID, FileType.ProfilePicture]);
        
        if (result.rows.length > 0 && result.rows[0]) { //Because profile picture is optional
            return {
                UUID: result.rows[0].uuid,
                name: result.rows[0].name,
                type: result.rows[0].type
            };
        }

        return undefined;
    };
}