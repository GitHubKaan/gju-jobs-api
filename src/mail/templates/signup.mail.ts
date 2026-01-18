import { EMailSender } from "../../enums";
import { ENV } from "../../utils/envReader.util";
import { toTimestamp, getCurrentDateTime } from "../../utils/time.util";
import { sendEmail } from "../mailTransporter.mail";

/**
 * Signup E-Mail
 * @param email Reciving E-Mail-Address
 * @param authCode Auth Code
 */
export function sendSignupMail(email: string, authCode: string) {
    const content = `
        Erfolgreich registriert!\n\n

        authCode: ${authCode}\n
        authCode expiration: ${toTimestamp(getCurrentDateTime() + ENV.AUTH_EXP * 1000)}
    `;
    sendEmail(EMailSender.NoReply, email, "Benutzerkonto Registrierung", content);
};