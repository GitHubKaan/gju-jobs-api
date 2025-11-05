import { EMailSender } from "../../enums";
import { getCurrentTimestamp } from "../../utils/time.util";
import { sendEmail } from "../mailTransporter.mail";

/**
 * Delete user confirmation E-Mail
 * @param email Reciving E-Mail-Address
 */
export function sendDeleteUserMail(email: string) {
    const content = `
        Konto gelöscht!\n\n

        Am: ${getCurrentTimestamp()}
    `;
    sendEmail(EMailSender.NoReply, email, "Benutzerkonto Löschung", content);
};