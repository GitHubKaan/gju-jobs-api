import { FileType } from "./enums";

export class TITLE {
    static readonly USER = "User";
    static readonly PATH = "Path";
    static readonly FILE = "File";
    static readonly FILES = "Files";
    static readonly DATA = "Data";
    static readonly E_MAIL_ADDRESS = "E-Mail-Address";
    static readonly TOKEN = "Token";
    static readonly AUTHENTICATION = "Authentication";
    static readonly RECOVERY = "Recovery";
    static readonly HELP_CALL = "Help call";
    static readonly SUPPORT_REQUEST = "Support request";
    static readonly ERROR = "Error";
}

export class MESSAGE {
    // General
    static readonly CONFIRMATION_EMAIL = "Success, confirmation E-Mail send.";
    static readonly SUCCESS = (value: string): string => `${value ? `${value} ` : ""}successful.`;
    static readonly DELETED = (value: string): string => `${value ? `${value} ` : ""}successfully deleted.`;
    static readonly ADDED = (value: string): string => `${value ? `${value} ` : ""}successfully added.`;
    static readonly SUBMITTED = (value: string): string => `${value ? `${value} ` : ""}successfully submitted.`;
    static readonly CREATED = (value: string): string => `${value ? `${value} ` : ""}successfully created.`;
    static readonly ACTIVATED = (value: string): string => `${value ? `${value} ` : ""}successfully activated.`;
    static readonly RETRIEVED = (value: string): string => `${value ? `${value} ` : ""}successfully retrieved.`;
    static readonly UPDATED = (value: string): string => `${value ? `${value} ` : ""}successfully updated.`;
    static readonly UPLOADED = (value: string): string => `${value ? `${value} ` : ""}successfully uploaded.`;

    static readonly ERROR = {
        // General
        TOO_MANY_REQUESTS: "Too many requests, please wait.",
        FAULTY: "Faulty request format.",
        INTERNAL_ERROR: "An internal error accured.",
        TIMEOUT: "The request took too long.",
        FORBIDDEN: "This action is forbidden.",
        TOO_LARGE: "Content too large.",
        FORMAT: (value?: string): string => `${value ? `${value} ` : ""}format wrong.`,
        DUPLICATE: (value?: string): string => `${value ? `${value} ` : ""}already exists.`,
        UNAUTHORIZED: (value?: string): string => `${value ? `${value} ` : ""}unauthorized.`,
        WRONG: (value?: string): string => `${value ? `${value} ` : ""}is wrong.`,
        ATTEMPTS_USED_UP: (value?: string): string => `${value ? `${value} ` : ""}attempts used up.`,
        NOT_FOUND: (value?: string): string => `${value ? `${value} ` : ""}not found.`,
        PARTIALLY_FOUND: (value?: string): string => `${value ? `${value} ` : ""}partially found.`,
        REQUIRED: (value?: string): string => `${value ? `${value} ` : ""}is required.`,
        UNIQUE: (value?: string): string => `${value ? `${value} ` : ""}must be unique.`,
        AVAILABLE: (value?: string): string => `${value ? `${value} ` : ""}is not available.`,
        AMOUNT_EXCEEDED: (maximum: number, value?: string) => `Total ${value ? `${value.toLocaleLowerCase()} ` : ""}amount can not exceed ${maximum}.`,
        SPECIFIC: (options: string[], value?: string) => `${value ? `${value} ` : ""}must contain one of the following: ${options.join(", ")}.`,
        ALREADY: (value?: string): string => `${value ? `${value} ` : ""}already done.`,
        DECISION: (value?: string): string => `${value ? `${value} ` : ""}available, choose between one.`,

        // File
        FILE_FORMAT: "Format not supportet.",
        FILE_ISSUE: "Issue with file.",
        MAX_FILE_SIZE: (size: number, unit: string): string => `Maximum size is ${size}${unit}`,
        MAX_UPLOAD_AMOUNT: (maximum: number, type?: FileType): string => `${type ? `${type} ` : ""}upload amount can not be more then ${maximum}.`,

        // String
        EMPTY: "value can not be empty",
        STRING: (value?: string): string => `${value ? `${value} ` : ""}needs to be a string.`,
        REGEX: (value?: string): string => `${value ? `${value} ` : ""}contains at least one illegal character.`,
        MIN_CHARACTERS: (minimum: number, value?: string): string => `${value ? `${value} ` : ""}must be at least ${minimum} characters in length, or longer.`,
        MAX_CHARACTERS: (maximum: number, value?: string): string => `${value ? `${value} ` : ""}cannot exceed ${maximum} characters in length.`,
        SPECIFIC_CHARACTER_LENGTH: (length: number, value?: string): string => `${value ? `${value} ` : ""}needs to be exactly ${length} characters long.`,

        // Integer/Double
        INT: (value?: string): string => `${value ? `${value} ` : ""}must be a integer.`,
        DECIMAL: (value?: string): string => `${value ? `${value} ` : ""}can have no more than two decimal places.`,
        MIN_INT: (minimum: number, value?: string) => `${value ? `${value} ` : ""}must be at least ${minimum}, or bigger.`,
        MAX_INT: (maximum: number, value?: string) => `${value ? `${value} ` : ""}cannot exceed ${maximum}.`,
        SPECIFIC_INT_LENGTH: (length: number, value?: string): string => `${value ? `${value} ` : ""}must be a ${length} digit number.`,
        RANGE: (minimum: number, maximum: number, value?: string): string => `${value ? `${value} ` : ""}must be between ${minimum} and ${maximum}.`,
        
        // Array
        ARRAY: (value?: string): string => `${value ? `${value} ` : ""}needs to be an array.`,
        NESTED_ARRAY: (value?: string): string => `${value ? `${value} ` : ""}needs to be an nested-array.`,
        MIN_ELEMENT: (minimum: number, value?: string): string => `${value ? `${value} ` : ""}must contain at least ${minimum} element.`,
        MAX_ELEMENT: (maximum: number, value?: string): string => `${value ? `${value} ` : ""}can not contain more then ${maximum} element(s).`,
        SPECIFIC_ELEMENT_LENGTH: (length: number, value?: string): string => `${value ? `${value} ` : ""}needs to contain exactly ${length} elements.`,

        // Boolean
        BOOLEAN: (value?: string): string => `${value ? `${value} ` : ""}needs to be an boolean.`,

        // Specific types
        EMAIL: (value?: string): string => `${value ? `${value} ` : ""}must be a E-Mail Address.`,
        URL: (value?: string): string => `${value ? `${value} ` : ""}must be a URL.`,
        HOSTNAME: (value?: string): string => `${value ? `${value} ` : ""}must be a valid hostname.`,
        UUID: (value?: string): string => `${value ? `${value} ` : ""}must be a UUID.`
    };
}