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

// Timestamp to unix for db
export function unixSecondsToDbTimestamp(unixSeconds: number): string {
    const date = new Date(unixSeconds * 1000);

    const pad = (n: number, width = 2) => n.toString().padStart(width, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
        
    const microseconds = pad(date.getMilliseconds(), 3) + "000";

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}`;
}