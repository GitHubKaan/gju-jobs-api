import { Request } from "express";
import UAParser from 'ua-parser-js';

/**
 * Get client device info
 * @param req Express request
 * @returns os; browser
 */
export function getDeviceInfo(
    req: Request
): {
    os?: string
    browser?: string
} {
    const userAgent = req.headers["user-agent"] ?? "user-agent";
    const parser = new UAParser();
    const result = parser.setUA(userAgent).getResult();
    
    return {
        os: result.os.name,
        browser: result.browser.name
    }
}