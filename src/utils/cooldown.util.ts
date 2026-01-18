import { getCurrentDateTime, toUNIX } from "./time.util";
import { CooldownError } from "./error.util";
import { ENV } from "./envReader.util";
import { StatusCodes } from "http-status-codes";
import { UUID } from "node:crypto";
import { UserService } from "../services/user.service";

/**
 * Check request cooldown
 * @param userUUID User UUID
 * @param isStudent
 * @returns statusCode
 */
export async function handleRequestCooldown(
    userUUID: UUID,
    isStudent: boolean,
): Promise<
    StatusCodes
> {
    const now = getCurrentDateTime();
    const userCooldown = await UserService.getCooldown(userUUID, isStudent);
    const cooldown = ENV.COOLDOWN * 1000;
    const cooldownUntil = toUNIX(userCooldown ?? "") + cooldown;

    if (userCooldown === null || cooldownUntil < now) { // No cooldown required
        UserService.setCooldown(userUUID, isStudent);
        return StatusCodes.OK;
    }
    
    let remainingSeconds = Math.ceil((cooldownUntil - now) / 1000);
    throw new CooldownError(remainingSeconds); // Cooldown required
}