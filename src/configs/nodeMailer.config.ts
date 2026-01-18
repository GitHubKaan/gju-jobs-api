import nodemailer from "nodemailer";
import { ENV } from "../utils/envReader.util";
import { CONSOLE } from "../utils/console.util";
import { EMailSender } from "../enums";

/**
 * Create individual transporter with Nodemailer
 * @param sender Sender E-Mail
 * @returns Transport
 */
export function createIndividualTransport(sender: EMailSender): {
    transporter: nodemailer.Transporter,
    sender: string,
} {
    let senderEmail = "";
    let senderPassword = "";
    
    switch (sender) { //Sender email account
        case EMailSender.System:
            senderEmail = ENV.SYSTEM_EMAIL;
            senderPassword = ENV.SYSTEM_EMAIL_PASSWORD;
            break;
        case EMailSender.NoReply:
            senderEmail = ENV.NO_REPLY_EMAIL;
            senderPassword = ENV.NO_REPLY_EMAIL_PASSWORD;
            break;
        case EMailSender.Support:
            senderEmail = ENV.SUPPORT_EMAIL;
            senderPassword = ENV.SUPPORT_EMAIL_PASSWORD;
            break;
        default:
            CONSOLE.ERROR("Could not find mailserver sender value.");
            break;
    }

    const transporter = nodemailer.createTransport({ //Mailserver settings
        host: ENV.OUTGOING_MAILSERVER,
        port: ENV.MAIL_SMTP_PORT,
        secure: true,
        auth: {
            user: senderEmail,
            pass: senderPassword,
        },
    });

    return {
        transporter: transporter,
        sender: senderEmail
    };
}