import randomize from "randomatic";

/**
 * Generate random string
 * @param type Allowed symbols (e. g. aA0, A0, 0 etc.)
 * @param length String length
 * @returns Random string
 */
export function randomString(type: string, length: number): string {
    return randomize(type, length);
}