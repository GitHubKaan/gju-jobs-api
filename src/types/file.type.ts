import { UUID } from "node:crypto";
import { FileType } from "../enums";

// File
interface BaseFile {
    UUID: UUID;
    name: string;
    type: FileType;
};
export type File = BaseFile;