import { EMailSender } from "../../enums";
import { Support } from "../../types/support.type";
import { ENV } from "../../utils/envReader.util";
import { sendEmail } from "../mailTransporter.mail";

/**
 * Support mail to customer service
 * @param email
 * @param phone Optional
 * @param type Support type
 * @param message
 * @param caseNumber
 */
export function sendCustomerServiceSupportMail(payload: Support, caseNumber: string) {
    const content = `
        Jemand braucht hilfe!\n\n

        case number: ${caseNumber}\n
        email: ${payload.email}\n
        phone: ${payload.phone}\n
        type: ${payload.type}\n
        message: ${payload.message}
    `;
    
    sendEmail(EMailSender.System, ENV.SUPPORT_EMAIL, `${caseNumber} ${payload.email} JEMAND BRAUCHT HILFE`, content);
};

/**
 * Support mail to customer
 * @param email
 * @param caseNumber
 */
export function sendSupportMail(email: string, caseNumber: string) {
    const content = `
        Wir haben deine nachricht erhalten und melden uns bald bei dir! Das hier ist deine case number ${caseNumber}\n\n
    `;
    
    sendEmail(EMailSender.NoReply, email, "Wir haben deine nachricht erhalten", content);
};