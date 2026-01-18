import * as path from "path";
import { NodeEnv, EnvType } from "../enums";
import { CONSOLE } from "./console.util";

require("dotenv").config();

export class ENV {
    // GENERAL
    static readonly NODE_ENV: NodeEnv = envAudit("NODE_ENV", EnvType.String, { specific: Object.values(NodeEnv) })

    static readonly VERSION: number = envAudit("VERSION", EnvType.Number);

    static readonly DEV_MAIL: boolean = envAudit("DEV_MAIL", EnvType.Boolean);
    static readonly STARTUP_TESTS: boolean = envAudit("STARTUP_TESTS", EnvType.Boolean);
    static readonly REMOVE_UNNUSED_FOLDERS: boolean = envAudit("REMOVE_UNNUSED_FOLDERS", EnvType.Boolean);
    
    // API
    static readonly API_HTTPS: boolean = envAudit("API_HTTPS", EnvType.Boolean);
    static readonly API_WWW: boolean = envAudit("API_WWW", EnvType.Boolean);
    static readonly API_HOST: string = envAudit("API_HOST", EnvType.String);
    static readonly API_PORT: number | undefined = envAudit("API_PORT", EnvType.Number, { optional: true });
    static readonly API_PATH: string | undefined = envAudit("API_PATH", EnvType.String, { optional: true });

    // FRONTEND
    static readonly FRONTEND_HTTPS: boolean = envAudit("FRONTEND_HTTPS", EnvType.Boolean);
    static readonly FRONTEND_WWW: boolean = envAudit("FRONTEND_WWW", EnvType.Boolean);
    static readonly FRONTEND_HOST: string = envAudit("FRONTEND_HOST", EnvType.String);
    static readonly FRONTEND_PORT: number | undefined = envAudit("FRONTEND_PORT", EnvType.Number, { optional: true });
    static readonly FRONTEND_PATH: string | undefined = envAudit("FRONTEND_PATH", EnvType.String, { optional: true });

    // POSTGRESQL
    static readonly SCHEMA_NAME: string = envAudit("SCHEMA_NAME", EnvType.String);
    static readonly DB_HOST: string = envAudit("DB_HOST", EnvType.String);
    static readonly DB_PORT: number = envAudit("DB_PORT", EnvType.Number);
    static readonly DB_USER: string = envAudit("DB_USER", EnvType.String);
    static readonly DB_PASSWORD: string = envAudit("DB_PASSWORD", EnvType.String);
    static readonly DB_POOL_MAX: number = envAudit("DB_POOL_MAX", EnvType.Number);
    static readonly DB_POOL_IDLE: number = envAudit("DB_POOL_IDLE", EnvType.Number);
    static readonly DB_POOL_TIMEOUT: number = envAudit("DB_POOL_TIMEOUT", EnvType.Number);

    // MAIL
    static readonly MAIL_NAME: string = envAudit("MAIL_NAME", EnvType.String);

    static readonly INCOMING_MAILSERVER: string = envAudit("INCOMING_MAILSERVER", EnvType.String);
    static readonly OUTGOING_MAILSERVER: string = envAudit("OUTGOING_MAILSERVER", EnvType.String);
    static readonly WEBMAIL_SERVER: string = envAudit("WEBMAIL_SERVER", EnvType.String);

    static readonly MAIL_SMTP_PORT: number = envAudit("MAIL_SMTP_PORT", EnvType.Number);
    static readonly MAIL_IMAP_PORT: number = envAudit("MAIL_IMAP_PORT", EnvType.Number);
    static readonly MAIL_POP3_PORT: number = envAudit("MAIL_POP3_PORT", EnvType.Number);
    static readonly MAIL_IMAP_SSL_TSL_PORT: number = envAudit("MAIL_IMAP_SSL_TSL_PORT", EnvType.Number);
    static readonly MAIL_POP3_SSL_TSL_PORT: number = envAudit("MAIL_POP3_SSL_TSL_PORT", EnvType.Number);

    static readonly MAIL_PORT_ENCRYPTION: string = envAudit("MAIL_PORT_ENCRYPTION", EnvType.String);
    static readonly MAIL_PORT_ENCRYPTION_SSL_TSL: string = envAudit("MAIL_PORT_ENCRYPTION_SSL_TSL", EnvType.String);

    static readonly SYSTEM_EMAIL: string = envAudit("SYSTEM_EMAIL", EnvType.String);
    static readonly SYSTEM_EMAIL_PASSWORD: string = envAudit("SYSTEM_EMAIL_PASSWORD", EnvType.String);

    static readonly NO_REPLY_EMAIL: string = envAudit("NO_REPLY_EMAIL", EnvType.String);
    static readonly NO_REPLY_EMAIL_PASSWORD: string = envAudit("NO_REPLY_EMAIL_PASSWORD", EnvType.String);

    static readonly SUPPORT_EMAIL: string = envAudit("SUPPORT_EMAIL", EnvType.String);
    static readonly SUPPORT_EMAIL_PASSWORD: string = envAudit("SUPPORT_EMAIL_PASSWORD", EnvType.String);

    // AUTH CODE
    static readonly AUTH_KEY: string = envAudit("AUTH_KEY", EnvType.String, { exactLength: 64, allowedCharacters: /^[a-zA-Z0-9]*$/ });
    static readonly AUTH_EXP: number = envAudit("AUTH_EXP", EnvType.Number);
    static readonly AUTH_CODE_LENGTH: number = envAudit("AUTH_CODE_LENGTH", EnvType.Number);
    static readonly AUTH_MAX_ATTEMPTS: number = envAudit("AUTH_MAX_ATTEMPTS", EnvType.Number);

    // JWT
    static readonly ACCESS_KEY: string = envAudit("ACCESS_KEY", EnvType.String, { exactLength: 64, allowedCharacters: /^[a-zA-Z0-9]*$/ });
    static readonly ACCESS_EXP: number = envAudit("ACCESS_EXP", EnvType.Number);

    static readonly RECOVERY_KEY: string = envAudit("RECOVERY_KEY", EnvType.String, { exactLength: 64, allowedCharacters: /^[a-zA-Z0-9]*$/ });
    static readonly RECOVERY_EXP: number = envAudit("RECOVERY_EXP", EnvType.Number);

    static readonly DELETION_KEY: string = envAudit("DELETION_KEY", EnvType.String, { exactLength: 64, allowedCharacters: /^[a-zA-Z0-9]*$/ });
    static readonly DELETION_EXP: number = envAudit("DELETION_EXP", EnvType.Number);

    static readonly BLACKLIST_CLEANUP_INTERVAL: number = envAudit("BLACKLIST_CLEANUP_INTERVAL", EnvType.Number);

    // ENCRYPTION
    static readonly ENCRYPTION_KEY: string = envAudit("ENCRYPTION_KEY", EnvType.String, { exactLength: 64, allowedCharacters: /^[a-z0-9]*$/ });
    static readonly HASH_KEY: string = envAudit("HASH_KEY", EnvType.String, { exactLength: 64, allowedCharacters: /^[a-z0-9]*$/ });
    
    // LIMINATIONS
    static readonly MAX_CONTENT_SIZE: number = envAudit("MAX_CONTENT_SIZE", EnvType.Number);

    // RATE LIMIT
    static readonly RATE_LIMIT: boolean = envAudit("RATE_LIMIT", EnvType.Boolean);

    static readonly HTTP_GLOBAL_WINDOW_MS: number = envAudit("HTTP_GLOBAL_WINDOW_MS", EnvType.Number);
    static readonly HTTP_GLOBAL_LIMIT: number = envAudit("HTTP_GLOBAL_LIMIT", EnvType.Number);

    static readonly SIGNUP_WINDOW_MS: number = envAudit("SIGNUP_WINDOW_MS", EnvType.Number);
    static readonly SIGNUP_LIMIT: number = envAudit("SIGNUP_LIMIT", EnvType.Number);

    static readonly LOGIN_WINDOW_MS: number = envAudit("LOGIN_WINDOW_MS", EnvType.Number);
    static readonly LOGIN_LIMIT: number = envAudit("LOGIN_LIMIT", EnvType.Number);

    static readonly GET_RECOVERY_WINDOW_MS: number = envAudit("GET_RECOVERY_WINDOW_MS", EnvType.Number);
    static readonly GET_RECOVERY_LIMIT: number = envAudit("GET_RECOVERY_LIMIT", EnvType.Number);

    static readonly GET_DELETE_WINDOW_MS: number = envAudit("GET_DELETE_WINDOW_MS", EnvType.Number);
    static readonly GET_DELETE_LIMIT: number = envAudit("GET_DELETE_LIMIT", EnvType.Number);

    static readonly SUPPORT_WINDOW_MS: number = envAudit("SUPPORT_WINDOW_MS", EnvType.Number);
    static readonly SUPPORT_LIMIT: number = envAudit("SUPPORT_LIMIT", EnvType.Number);

    static readonly SEND_FRONTEND_ERROR_WINDOW_MS: number = envAudit("SEND_FRONTEND_ERROR_WINDOW_MS", EnvType.Number);
    static readonly SEND_FRONTEND_ERROR_LIMIT: number = envAudit("SEND_FRONTEND_ERROR_LIMIT", EnvType.Number);

    static readonly WS_WINDOW_MS: number = envAudit("WS_WINDOW_MS", EnvType.Number);
    static readonly WS_LIMIT: number = envAudit("WS_LIMIT", EnvType.Number);

    // TIMEOUT
    static readonly GLOBAL_TIMEOUT: number = envAudit("GLOBAL_TIMEOUT", EnvType.Number);
    static readonly UPLOAD_IMAGES_TIMEOUT: number = envAudit("UPLOAD_IMAGES_TIMEOUT", EnvType.Number);

    // COOLDOWN
    static readonly COOLDOWN: number = envAudit("COOLDOWN", EnvType.Number);

    // FILE
    static readonly UPLOADS_PATH: string | undefined = envAudit("UPLOADS_PATH", EnvType.String, { optional: true })

    static readonly IMAGE_TYPES: string = envAudit("IMAGE_TYPES", EnvType.String);
    static readonly IMAGE_NAME_LENGTH: number = envAudit("IMAGE_NAME_LENGTH", EnvType.Number);

    static readonly IMAGE_MAX_INIT_DIM: number = envAudit("IMAGE_MAX_INIT_DIM", EnvType.Number);
    static readonly IMAGE_RESIZE_RATE: number = envAudit("IMAGE_RESIZE_RATE", EnvType.Number);
    static readonly IMAGE_COMPRESSION_RATE: number = envAudit("IMAGE_COMPRESSION_RATE", EnvType.Number);
    
    static readonly PROFILE_PICTURE_MAX_SIZE: number = envAudit("PROFILE_PICTURE_MAX_SIZE", EnvType.Number);

    // IMAGE
    static readonly IMAGE_UPLOAD_PATH: string = envAudit("IMAGE_UPLOAD_PATH", EnvType.String);

    // CORS
    static readonly USE_CORS: boolean = envAudit("USE_CORS", EnvType.Boolean);

    // STUDENT
    static readonly ALLOWED_STUDENT_DOMAIN: string = envAudit("ALLOWED_STUDENT_DOMAIN", EnvType.String);
}

envIntegrity();

export const getBackendOrigin = (): string => {
    const protocol = ENV.API_HTTPS ? "https://" : "http://";
    const www = ENV.API_WWW ? "www." : "";
    const host = ENV.API_HOST;
    const port = ENV.API_PORT ? `:${ENV.API_PORT}` : "";
    const path = ENV.API_PATH ? `/${ENV.API_PATH}` : "";
    const version = ENV.VERSION ? `/v${ENV.VERSION}` : "";
    
    return `${protocol}${www}${host}${port}${path}${version}`;
}

export const getBackendPath = (): string => {
    const path = ENV.API_PATH ? `/${ENV.API_PATH}` : "";
    const version = ENV.VERSION ? `/v${ENV.VERSION}` : "";
    
    return `${path}${version}`;
}

export const getFrontendOrigin = (): string => {
    const protocol = ENV.FRONTEND_HTTPS ? "https://" : "http://";
    const www = ENV.FRONTEND_WWW ? "www." : "";
    const host = ENV.FRONTEND_HOST;
    const port = ENV.FRONTEND_PORT ? `:${ENV.FRONTEND_PORT}` : "";
    const path = ENV.FRONTEND_PATH ? `/${ENV.FRONTEND_PATH}` : "";

    return `${protocol}${www}${host}${port}${path}`;
}

/**
 * Parrent user data path
 */
let currentUserDataPath: string;
switch (ENV.NODE_ENV) {
    case NodeEnv.Dev: currentUserDataPath = "/dev"; break;
    case NodeEnv.Production: currentUserDataPath = "/production"; break;
    case NodeEnv.Testing: currentUserDataPath = "/testing"; break;
}
/**
 * @param parrentOnly Return parrent user data path without environment path (e. g. path instead of path/dev) 
 * @returns User data path
 */
export function userDataPath(parrentOnly?: boolean) {
    return path.join(ENV.UPLOADS_PATH ?? "", `user_data${parrentOnly ? "" : currentUserDataPath}`);
}

/**
 * Get individual user upload path
 * @param userUUID 
 * @returns Specific user data path
 */
export const getIndividualUserDataPath = (userUUID: string): string => {
    return path.join(userDataPath(), userUUID);
}

/**
 * Image types
 */
export const imageTypes = ENV.IMAGE_TYPES ? ENV.IMAGE_TYPES.split(",") : "";

/**
 * Environment value audit
 * @param key Key-Name
 * @param type Variable type
 * @param specifications Further specifications (optional; exactLength; min; allowedCharacters)
 * @returns Value
 */
function envAudit(
    key: string,
    type: EnvType,
    specifications?: {
        optional?: boolean, // Is optional value
        exactLength?: number, // Exact string length
        min?: number, // Min number
        allowedCharacters?: RegExp, // Allowed characters as Regex
        specific?: string[]
    }
): any { // Needs to be any because some values require numbers, boolean etc. exclusively
    try {
        const value = process.env[key];
        
        let convertedValue: undefined | string | number | boolean = undefined;
        switch (type) {
            case EnvType.String:
                if (value !== undefined && value.trim().length === 0) { // Values with spaces only will be undefined
                    convertedValue = undefined;
                    break;
                }
                convertedValue = value;
                break;
            case EnvType.Boolean: // "Boolean(JSON.prase())" will not be used because 0 & 1 could also be true/false
                if (value === "true") {
                    convertedValue = true;
                } else if (value === "false") {
                    convertedValue = false;
                } else {
                    throw CONSOLE.ERROR(`Environment variable ${key} needs to be a ${type}.`);
                }
                break;
            case EnvType.Number:
                if (!isNaN(Number(value))) {
                    convertedValue = Number(value);
                } else {
                    throw CONSOLE.ERROR(`Environment variable ${key} needs to be a ${type}.`);
                }
                break;
            default: break;
        }

        if (!specifications && convertedValue === undefined) { // Necessary value missing
            throw CONSOLE.ERROR(`Environment variable ${key} is missing.`);
        }

        if (specifications) { // Specification checks
            // Optional check
            if (specifications.optional && convertedValue === undefined) {
                return;
            }

            // exactLength
            if (specifications.exactLength) {
                if (type !== EnvType.String) {
                    throw CONSOLE.ERROR(`Environment variable ${key} can not contain "exactLength" property without being a string.`);
                }
                if (typeof convertedValue !== "string") {
                    throw CONSOLE.ERROR(`Environment variable ${key} needs to be a string if specification contains "exactLength" element.`);
                }
                if (convertedValue.length !== specifications.exactLength) {
                    throw CONSOLE.ERROR(`Environment variable ${key} needs to be ${specifications.exactLength} characters long.`);
                }
            }

            // min
            if (specifications.min) {
                if (type !== EnvType.Number) {
                    throw CONSOLE.ERROR(`Environment variable ${key} can not contain "min" property without being a number.`);
                }
                if (typeof convertedValue !== "number") {
                    throw CONSOLE.ERROR(`Environment variable ${key} needs to be a number if specification contains "min" element.`);
                }
                if (convertedValue < specifications.min) {
                    throw CONSOLE.ERROR(`Environment variable ${key} needs to be bigger or equal to ${specifications.min}.`);
                }
            }

            // allowedCharacters
            if (specifications.allowedCharacters) {
                if (type !== EnvType.String) {
                    throw CONSOLE.ERROR(`Environment variable ${key} must be a string to check for allowed characters.`);
                }
                if (typeof convertedValue === "string") {
                    if (!specifications.allowedCharacters.test(convertedValue)) {
                        throw CONSOLE.ERROR(`Environment variable ${key} contains invalid characters. (Allowed: ${specifications.allowedCharacters})`);
                    }
                }
            }

            // specific
            if (specifications.specific) {
                if (type !== EnvType.String) {
                    throw CONSOLE.ERROR(`Environment variable ${key} must be a string to check against specific values.`);
                }
                
                if (typeof convertedValue === "string") {
                    if (!specifications.specific.includes(convertedValue)) {
                        throw CONSOLE.ERROR(`Environment variable ${key} must be one of: ${specifications.specific.join(", ")}`);
                    }
                }
            }
        }

        return convertedValue;
    } catch (error: any) {
        process.exit(error); // Stop API from starting when .env issue found
    }
}

/**
 * Further (logical) Environment value checks
 */
function envIntegrity() {
    try {
        if (ENV.BLACKLIST_CLEANUP_INTERVAL < Math.max(ENV.AUTH_EXP, ENV.RECOVERY_EXP, ENV.DELETION_EXP)) {
            throw CONSOLE.ERROR(`BLACKLIST_CLEANUP_INTERVAL needs to be bigger then AUTH_EXP, RECOVERY_EXP and DELETION_EXP`);
        }
    } catch (error: any) {
        process.exit(error); // Stop API from starting when .env issue found
    }
}