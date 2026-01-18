import { EMailSender } from "../../enums";
import { ENV } from "../../utils/envReader.util";
import { toTimestamp, getCurrentDateTime } from "../../utils/time.util";
import { sendEmail } from "../mailTransporter.mail";

/**
 * Login E-Mail
 * @param email Reciving E-Mail-Address
 * @param authCode Auth Code
 */
export function sendLoginMail(email: string, authCode: string) {
    const content = `
        Loginversuch!\n\n

        authCode: ${authCode}\n
        authCode expiration: ${toTimestamp(getCurrentDateTime() + ENV.AUTH_EXP * 1000)}
    `;
    sendEmail(EMailSender.NoReply, email, "Benutzerkonto Anmeldeversuch", content);
};