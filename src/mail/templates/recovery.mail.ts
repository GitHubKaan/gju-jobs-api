import { EMailSender } from "../../enums";
import { getCurrentTimestamp } from "../../utils/time.util";
import { sendEmail } from "../mailTransporter.mail";

/**
 * Recovered confirmation E-Mail
 * @param email Reciving E-Mail-Address
 */
export function sendRecoveryMail(email: string) {
    const content = `
        Account wiederherstellt!\n\n

        Alle Geräte die jemals Zugriff hatten, haben jetzt keinen mehr.

        recovery date: ${getCurrentTimestamp()}
    `;
    sendEmail(EMailSender.NoReply, email, "Benutzerkonto Wiederherstellt", content);
};