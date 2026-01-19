import { ENV } from "../utils/envReader.util";
import { createIndividualTransport } from "../configs/nodeMailer.config";
import { EMailSender, NodeEnv } from "../enums";
import { addInternalError } from "../utils/internalError.util";

/**
 * Send EMail
 * @param sender Sender E-Mail-Adress
 * @param reciver Reciving E-Mail-Adress
 * @param subjectTitle Subject title text
 * @param content Content
 */
export async function sendEmail(
    sender: EMailSender,
    reciver: string,
    subjectTitle: string,
    content: string
) {
    const transport = createIndividualTransport(sender);
    
    const mailOptions = { //Mail structure
        from: `${ENV.MAIL_NAME} <${transport.sender}>`,
        to: reciver,
        subject: subjectTitle,
        html: content,
        attachments: [
            
            {
                filename: "mail_logo.png",
                path: "images/mail/mail_logo.png",
                cid: "logoID"
            },
            /*
            {
                filename: "logo.png",
                path: "images/mail/twitter.png",
                cid: "twitterID"
            },
            {
                filename: "logo.png",
                path: "images/mail/youtube.png",
                cid: "youtubeID"
            }
            */
        ]
    };

    if ( //Prevent e-mails from being send if dev- or test-mode
        ENV.NODE_ENV === NodeEnv.Dev && !ENV.DEV_MAIL || // If Dev-Mode and DEV_MAIL is false
        ENV.NODE_ENV === NodeEnv.Testing // If Test-Mode
    ) {
        return;
    }
    
    try {
        await transport.transporter.sendMail(mailOptions);
    } catch (error: any) {
        if (error.responseCode !== 450) { //Email not found check (so only internal errors get captured)
            addInternalError(error, true, true);
        }
    }
}
