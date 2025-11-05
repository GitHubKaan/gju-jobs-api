/**
 * Get current UTC Datetime (needs to be an function, will not update as a const)
 * Date.now() is the same
 * @returns Current Datetime
 */
export function getCurrentDateTime(): number {
    return new Date().getTime();
}

/**
 * Get current Timestamp (Needs to be an function, will not update as a const)
 * @returns Current Timestamp
 */
export function getCurrentTimestamp(): string {
    return toTimestamp(getCurrentDateTime());
}

/**
 * Convert timestamp to UNIX time (local time)
 * @param timestamp Timestamp
 * @returns UNIX time
 */
export function toUNIX(timestamp: string): number {
    return new Date(timestamp).getTime();
}

/**
 * Convert time to timestamp
 * @param time Time (current time -- not UTC)
 * @param database For database? (optional)
 * @returns Timestamp
 */
export function toTimestamp(time: number, database?: boolean): string {
    const timestamp = new Date(time);

    if (database) {
        return timestamp.toISOString().slice(0, 19).replace("T", " ");
    }
    return timestamp.toLocaleString();
}