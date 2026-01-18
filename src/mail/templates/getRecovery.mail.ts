import { EMailSender } from "../../enums";
import { Token } from "../../utils/token.util";
import { sendEmail } from "../mailTransporter.mail";

/**
 * Get recovery E-Mail
 * @param email Reciving E-Mail-Address
 * @param token Token
 */
export function sendGetRecoveryMail(email: string, token: string) {
    const content = `
        Wiederherstellungsversuch!\n\n

        token: ${Token.link(token, Token.getPayload(token).type)}\n
        token expiration: ${Token.expToTimestamp(Token.getPayload(token).exp)}
    `;
    sendEmail(EMailSender.NoReply, email, "Benutzerkonto Wiederherstellung", content);
};