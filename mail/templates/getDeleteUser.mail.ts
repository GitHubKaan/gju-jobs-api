import { EMailSender } from "../../enums";
import { Token } from "../../utils/token.util";
import { sendEmail } from "../mailTransporter.mail";

/**
 * Get delete user E-Mail
 * @param email Reciving E-Mail-Address
 * @param authCode Auth Code
 */
export function sendGetDeleteUserMail(email: string, token: string) {
    const content = `
        Löschversuch!\n\n

        token: ${Token.link(token, Token.getPayload(token).type)}\n
        token expiration: ${Token.expToTimestamp(Token.getPayload(token).exp)}
    `;
    sendEmail(EMailSender.NoReply, email, "Benutzerkonto Löschversuch", content);
};