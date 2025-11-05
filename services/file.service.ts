import { DefaultError } from "../utils/error.util";
import { MESSAGE, TITLE } from "../responseMessage";
import { v4 as uuidv4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import { FileType } from "../enums";
import { DBPool } from "../configs/postgreSQL.config";
import { UUID } from "crypto";
import { File } from "../types/file.type";

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
        let query = `
            SELECT COUNT(*) AS total_entries
            FROM uploads
            WHERE user_uuid = $1
            AND type = $2;
        `;
        
        const result = await DBPool.query(query, [userUUID, type]);

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
        const query = `
            INSERT INTO uploads (
                user_uuid,
                uuid,
                name,
                type
            )
            VALUES ($1, $2, $3, $4);
        `;
    
        const fileUUID = uuidv4() as UUID;
        await DBPool.query(query, [userUUID, fileUUID, fileName, type]);

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
        const query = `
            SELECT
                uuid AS "UUID",
                name,
                type
            FROM uploads
            WHERE user_uuid = $1
            ORDER BY type;
        `;
        
        const result = await DBPool.query(query, [userUUID]);

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
        const query = `
            SELECT
                name,
                type
            FROM uploads
            WHERE uuid = $1
            AND user_uuid = $2;
        `;
        
        const result = await DBPool.query(query, [UUID, userUUID]);

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
        const query = `
            SELECT * 
            FROM uploads 
            WHERE user_uuid = $1
            AND uuid = $2;
        `;
        
        const result = await DBPool.query(query, [userUUID, UUID]);

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
        const query = `
            SELECT name
            FROM uploads
            WHERE uuid = $1;
        `;

        const result = await DBPool.query(query, [UUID]);
        
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
        let query = `
            DELETE FROM uploads
            WHERE uuid = $1
            AND user_uuid = $2;
        `;
        
        const result = await DBPool.query(query, [UUID, userUUID]);

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
        const query = `
            SELECT *
            FROM uploads
            WHERE user_uuid = $1
            AND type = $2;
        `;
    
        const result = await DBPool.query(query, [userUUID, FileType.ProfilePicture]);
        
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