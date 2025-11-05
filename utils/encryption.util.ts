import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { ENV } from "./envReader.util";
import { InternalError } from "./error.util";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(ENV.ENCRYPTION_KEY, "hex");

/**
 * Encrypt string value (Careful, do not input NULL or undefined value!)
 * @param value Value to encrypt
 * @returns Encypted value
 */
export function encrypt(value: string): string {
    try {
        const iv = randomBytes(12); // 12 random bytes
        const cipher = createCipheriv(ALGORITHM, KEY, iv);

        let encrypted = cipher.update(value, "utf8", "hex");
        encrypted += cipher.final("hex");

        const authTag = cipher.getAuthTag(); // Create Auth-Tag

        // IV:Auth-Tag:Encrypted value
        return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
    } catch (error: any) {
        throw new InternalError(error);
    }
}

/**
 * Decrypt encrypted string value (Careful, do not input NULL or undefined value!)
 * @param encryptedValue Encrypted string value
 * @returns Decrypted value
 */
export function decrypt(encryptedValue: string): string {
    try {
        const [ivHex, authTagHex, encrypted] = encryptedValue.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const authTag = Buffer.from(authTagHex, "hex");

        const decipher = createDecipheriv(ALGORITHM, KEY, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error: any) {
        throw new InternalError(error);
    }
}