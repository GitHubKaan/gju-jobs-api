import fs from "fs";
import * as path from "path";
import { UUID } from "crypto";
import { ENV, getIndividualUserDataPath, userDataPath } from "./envReader.util";
import { addInternalError } from "./internalError.util";
import sharp from "sharp";
import { DefaultError, ValidationError } from "./error.util";
import multer from "multer";
import { MESSAGE } from "../responseMessage";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/user.service";
import { CONSOLE } from "./console.util";
import { unlink } from "fs/promises";

declare module "express-serve-static-core" {
    interface Request {
        fileValidationError?: Error;
    }
}

/**
 * Delete File (Check User permission before)
 * @param userUUID User UUID
 * @param fileName File name
 */
export function deleteLocalFile(
    userUUID: UUID,
    fileName: string
) {
    try {
        fs.unlinkSync(`${getIndividualUserDataPath(userUUID)}/${fileName}`);
    } catch (error: any) {
        addInternalError(error, true, true);
    }
}

/**
 * Delete UUID Filepath (Check if user UUID exists before)
 * @param userUUID User UUID
 */
export function deleteLocalUUIDFilepath(
    userUUID: UUID
) {
    try {
        fs.rmSync(getIndividualUserDataPath(userUUID), { recursive: true, force: true });
    } catch (error: any) {
        addInternalError(error, true, true);
    }
}

/**
 * Delete all testing files
 */
export async function deleteTestingFiles() {
    try {
        const filesAndDirs = fs.readdirSync(userDataPath());

        for (const fileOrDir of filesAndDirs) {
            if (fileOrDir === ".gitignore") {
                continue;
            }

            const fullPath = path.join(userDataPath(), fileOrDir);
            fs.rmSync(fullPath, { recursive: true, force: true });
        }
    } catch (error: any) {
        addInternalError(error, true, true);
    }
}

/**
 * Create upload folder for User
 * @param userUUID 
 */
export function createUserUploadFolder(userUUID: UUID) {
    const path = getIndividualUserDataPath(userUUID);

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

/**
 * File upload
 * @param res Response
 * @param req Request
 * @param format Multer format
 * @returns filename
 */
export function fileUpload(
    res: Response,
    req: Request,
    format: multer.Multer,
): Promise<
    string
> {
    return new Promise((resolve, reject) => {
        format.single("file")(req, res, async (error: any) => { // Only for single files -- if multiple files need to be uploaded new function needs to be created
            try {
                if (req.fileValidationError) { // FIX: To catch mimetype issues before all the other stuff
                    return reject(req.fileValidationError);
                }

                if (error) { // Error from "format.util.ts" "pictureUpload"-function will be catched here
                    throw error;
                }

                if (!req.file) {
                    throw new ValidationError(MESSAGE.ERROR.FILE_ISSUE, "file");
                }

                /*
                    Reading file from memory alternative (not very efficient)
                    const buffer = await fs.promises.readFile(filePath);
                    const type = await fromBuffer(buffer);
                */

                // Read file inside Buffer
                const filePath = req.file.path;
                const originalBuffer = await fs.promises.readFile(filePath);
                
                const jpegBuffer = await convertToJPEG(originalBuffer); // Convert image to JPEG and compress

                await unlink(filePath); // Delete old file and keep new one (e. g. Delete PNG and keep JPEG)

                const newFilename = req.file.filename.replace(path.extname(req.file.filename), ".jpeg");
                const newPath = path.join(req.file.destination, newFilename);

                await fs.promises.writeFile(newPath, jpegBuffer); // Save new JPEG image

                return resolve(newFilename);

            } catch (error: any) {
                if (error instanceof ValidationError) {
                    const { description, label } = error; //Extract only this Props (Because some "format.util.ts"-"cb" errors will return more Props)
                    return reject(new ValidationError(description, label));
                }

                if (error.code === "LIMIT_FILE_SIZE") {
                    return reject(new DefaultError(StatusCodes.REQUEST_TOO_LONG, MESSAGE.ERROR.MAX_FILE_SIZE(0, "MB")));
                }

                addInternalError(error, true, true)
                return reject(new ValidationError(MESSAGE.ERROR.FILE_ISSUE, "file"));
            }
        });
    });
}

/**
 * Convert image to JPEG and resize
 * @param IMGBuffer 
 * @returns JPEG Image
 */
export async function convertToJPEG(
    IMGBuffer: Buffer
): Promise<Buffer> {
    try {
        const image = sharp(IMGBuffer, { failOnError: true });
        const metadata = await image.metadata();

        const MAX_DIM = ENV.IMAGE_MAX_INIT_DIM;

        if ((metadata.width && metadata.width > MAX_DIM) ||
            (metadata.height && metadata.height > MAX_DIM)) {
            throw new ValidationError(`Image too large (max ${MAX_DIM}px horizontally and vertically allowed)`, "file");
        }

        return await image
            .resize({ width: ENV.IMAGE_RESIZE_RATE, fit: "inside" })
            .jpeg({ quality: ENV.IMAGE_COMPRESSION_RATE })
            .toBuffer();

    } catch (error: unknown) {
        throw new ValidationError(MESSAGE.ERROR.FILE_ISSUE, "file"); // Compression error
    }
}

/**
 * Delete unnused folders from users UUIDs that dont exists anymore
 */
export async function deleteUnnusedUploadFolders() {
    try {
        const UUIDs: string[] = await UserService.getAllUsers();
        const allowedFolders = new Set([...UUIDs]);

        const folders = await fs.promises.readdir(userDataPath(), { withFileTypes: true });

        let counter: number = 0;
        for (const folder of folders) {
            if (folder.isDirectory()) {
                const folderName = folder.name;

                if (!allowedFolders.has(folderName)) {
                    const fullPath = path.join(userDataPath(), folderName);
                    await fs.promises.rm(fullPath, { recursive: true, force: true });
                    counter++;
                }
            }
        }

        if (counter) {
            CONSOLE.SUCCESS(`${counter} unnused user-upload folder${counter > 1 ? "s" : ""} deleted.`);
        }
    } catch (error: unknown) {
        CONSOLE.ERROR("Issue while deleting unnused user upload folders.")
        console.error(error);
    }
}

/**
 * Create upload folder -- if not already created
 */
export function createUploadFolder() {
    if (!fs.existsSync(userDataPath())) { // Create "user_data" folder if not existing
        fs.mkdirSync(userDataPath(), { recursive: true });
    }

    const subfolders = ["dev", "production", "testing"];
    for (const folder of subfolders) { // Create subfolders inside "user_data" if not existing
        const fullPath = path.join(userDataPath(true), folder); // Parrent path needed because else it would be user_data > dev > dev, production, testing

        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    }
}