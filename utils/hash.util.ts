import { createHmac } from "crypto";
import { ENV } from "./envReader.util";

/**
 * Hash value
 * @param value
 * @returns Hashed value as 64 character hex string (normal sha256 length)
 */
export function hashValue(value: string): string {
    return createHmac("sha256", ENV.HASH_KEY).update(value).digest("hex");
}