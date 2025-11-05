import { EMailSender } from "../../enums";
import { getCurrentTimestamp } from "../../utils/time.util";
import { sendEmail } from "../mailTransporter.mail";

/**
 * Auth E-Mail
 * @param email Reciving E-Mail-Address
 * @param authCode Auth Code
 */
export function sendAuthMail(email: string, os: string | undefined, browser: string | undefined) {
    const content = `
        Erfolgreich Angemeldet! Warst du dass?\n\n

        os: ${os ?? "Unbekannt"}\n
        browser: ${browser ?? "Unbekannt"}
        time: ${getCurrentTimestamp()}
    `;
    sendEmail(EMailSender.NoReply, email, "Benutzerkonto Angemeldet", content);
};