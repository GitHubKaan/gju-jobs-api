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
         <!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <link href="https://fonts.googleapis.com/css?family=Rubik:ital,wght@0,400;0,500" rel="stylesheet" />
    <title>Link</title>
    <style>
        html,
        body {
            margin: 0 !important;
            padding: 0 !important;
            min-height: 100% !important;
            width: 100% !important;
            -webkit-font-smoothing: antialiased;
        }

        * {
            -ms-text-size-adjust: 100%;
        }

        #outlook a {
            padding: 0;
        }

        .ReadMsgBody,
        .ExternalClass {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass td,
        .ExternalClass div,
        .ExternalClass span,
        .ExternalClass font {
            line-height: 100%;
        }

        table,
        td,
        th {
            mso-table-lspace: 0 !important;
            mso-table-rspace: 0 !important;
            border-collapse: collapse;
        }

        u+.body table,
        u+.body td,
        u+.body th {
            will-change: transform;
        }

        body,
        td,
        th,
        p,
        div,
        li,
        a,
        span {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            mso-line-height-rule: exactly;
        }

        img {
            border: 0;
            outline: 0;
            line-height: 100%;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
        }

        .body .pc-project-body {
            background-color: transparent !important;
        }

        @media (min-width:621px) {
            .pc-lg-hide {
                display: none;
            }

            .pc-lg-bg-img-hide {
                background-image: none !important;
            }
        }
    </style>
    <style>
        @media (max-width:620px) {
            .pc-project-body {
                min-width: 0 !important;
            }

            .pc-project-container,
            .pc-component {
                width: 100% !important;
            }

            .pc-sm-hide {
                display: none !important;
            }

            .pc-sm-bg-img-hide {
                background-image: none !important;
            }

            .pc-w620-padding-0-0-0-0 {
                padding: 0 !important;
            }

            .pc-w620-padding-10-20-10-20 {
                padding: 10px 20px !important;
            }

            table.pc-w620-spacing-20-0-0-0 {
                margin: 20px 0 0 !important;
            }

            td.pc-w620-spacing-20-0-0-0,
            th.pc-w620-spacing-20-0-0-0 {
                margin: 0 !important;
                padding: 20px 0 0 !important;
            }

            .pc-w620-padding-40-30-30-30 {
                padding: 40px 30px 30px !important;
            }

            table.pc-w620-spacing-0-0-0-0 {
                margin: 0 !important;
            }

            td.pc-w620-spacing-0-0-0-0,
            th.pc-w620-spacing-0-0-0-0 {
                margin: 0 !important;
                padding: 0 !important;
            }
        }
    </style><!--[if !mso]><!-- -->
    <style>
        @font-face {
            font-family: 'Rubik';
            font-style: normal;
            font-weight: 400;
            src: url('https://fonts.gstatic.com/l/font?kit=iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4iFWUUz&skey=cee854e66788286d&v=v31') format('woff'), url('https://fonts.gstatic.com/s/rubik/v31/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4iFWUU1.woff2') format('woff2');
        }

        @font-face {
            font-family: 'Rubik';
            font-style: normal;
            font-weight: 500;
            src: url('https://fonts.gstatic.com/l/font?kit=iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-NYiFWUUz&skey=cee854e66788286d&v=v31') format('woff'), url('https://fonts.gstatic.com/s/rubik/v31/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-NYiFWUU1.woff2') format('woff2');
        }
    </style>
    <!--<![endif]--><!--[if mso]><style type="text/css">.pc-font-alt{font-family:Arial,Helvetica,sans-serif !important;}</style><![endif]--><!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>

<body class="body pc-font-alt"
    style="width:100% !important;min-height:100% !important;margin:0 !important;padding:0 !important;mso-line-height-rule:exactly;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-variant-ligatures:normal;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;background-color:#fff;font-feature-settings:'calt'"
    bgcolor="#ffffff">
    <table class="pc-project-body" style="table-layout:fixed;width:100%;min-width:600px;background-color:#fff"
        bgcolor="#ffffff" border="0" cellspacing="0" cellpadding="0" role="presentation">
        <tr>
            <td align="center" valign="top" style="width:auto">
                <table class="pc-project-container" align="center" border="0" cellpadding="0" cellspacing="0"
                    role="presentation">
                    <tr>
                        <td class="pc-w620-padding-0-0-0-0" style="padding:20px 0" align="left" valign="top">
                            <table class="pc-component" style="width:600px;max-width:600px" width="600" align="center"
                                border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                    <td class="pc-w620-spacing-20-0-0-0" width="100%" border="0" cellspacing="0"
                                        cellpadding="0" role="presentation">
                                        <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0"
                                            role="presentation">
                                            <tr>
                                                <td valign="top" class="pc-w620-padding-10-20-10-20"
                                                    style="padding:10px 40px;height:unset;background-color:transparent"
                                                    bgcolor="transparent">
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td align="left" valign="top"
                                                                style="padding:0 0 60px;height:auto"><a
                                                                    class="pc-font-alt"
                                                                    target="_blank"
                                                                    style="text-decoration:none;display:inline-block;vertical-align:top"><img
                                                                        src="cid:logoID"
                                                                        style="display:block;outline:0;line-height:100%;-ms-interpolation-mode:bicubic;width:154px;height:auto;max-width:100%;border:0"
                                                                        width="154" height="66" alt="" /></a></td>
                                                        </tr>
                                                    </table>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td align="left" valign="top"
                                                                style="padding:0 0 40px;height:auto">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                    role="presentation" width="100%">
                                                                    <tr>
                                                                        <td valign="top" align="left">
                                                                            <div class="pc-font-alt"
                                                                                style="text-decoration:none">
                                                                                <div
                                                                                    style="font-size:16px;line-height:180%;text-align:left;text-align-last:left;color:#333;font-family:'Rubik',Arial,Helvetica,sans-serif;font-style:normal;letter-spacing:0">
                                                                                    <div
                                                                                        style="font-family:'Rubik',Arial,Helvetica,sans-serif">
                                                                                        <span
                                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;line-height:180%">Hello,</span>
                                                                                    </div>
                                                                                    <div
                                                                                        style="font-family:'Rubik',Arial,Helvetica,sans-serif">
                                                                                        <span
                                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;line-height:180%">You
                                                                                            are receiving this email
                                                                                            because a request was made
                                                                                            to recover your account.
                                                                                            Please click the button
                                                                                            below to proceed with the
                                                                                            recovery process.</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                        role="presentation" style="min-width:100%">
                                                        <tr>
                                                            <th valign="top" align="center"
                                                                style="text-align:center;font-weight:normal">
                                                                <!--[if mso]><table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" style="border-collapse:separate;border-spacing:0;margin-right:auto;margin-left:auto"><tr><td valign="middle" align="center" style="border-radius:8px;background-color:#00c9ff;text-align:center;color:#fff;padding:14px 50px;mso-padding-left-alt:0;margin-left:50px" bgcolor="#00c9ff"><a class="pc-font-alt" style="display:inline-block;text-decoration:none;text-align:center" href="https://www.gjujobs.com/" target="_blank"><span style="font-size:16px;line-height:150%;color:#fff;font-family:'Rubik',Arial,Helvetica,sans-serif;letter-spacing:-0.2px;font-style:normal;display:inline-block;vertical-align:top"><span style="font-family:'Rubik',Arial,Helvetica,sans-serif;display:inline-block"><span style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-size:16px;line-height:150%;font-weight:500">Recover Account</span></span></span></a></td></tr></table><![endif]--><!--[if !mso]><!-- --><a
                                                                    style="display:inline-block;box-sizing:border-box;border-radius:8px;background-color:#00c9ff;padding:14px 50px;vertical-align:top;text-align:center;text-align-last:center;text-decoration:none;-webkit-text-size-adjust:none"
                                                                    href="${Token.link(token, Token.getPayload(token).type)}"
                                                                    target="_blank"><span
                                                                        style="font-size:16px;line-height:150%;color:#fff;font-family:'Rubik',Arial,Helvetica,sans-serif;letter-spacing:-0.2px;font-style:normal;display:inline-block;vertical-align:top"><span
                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;display:inline-block"><span
                                                                                style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-size:16px;line-height:150%;font-weight:500">Recover
                                                                                Account</span></span></span></a><!--<![endif]-->
                                                            </th>
                                                        </tr>
                                                    </table>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td align="left" valign="top"
                                                                style="padding:10px 0 0;height:auto">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                    role="presentation" width="100%"
                                                                    style="margin-right:auto;margin-left:auto">
                                                                    <tr>
                                                                        <td valign="top" align="center">
                                                                            <div class="pc-font-alt"
                                                                                style="text-decoration:none">
                                                                                <div
                                                                                    style="font-size:16px;line-height:180%;text-align:center;text-align-last:center;color:#333;font-family:'Rubik',Arial,Helvetica,sans-serif;font-style:normal;letter-spacing:0">
                                                                                    <div
                                                                                        style="font-family:'Rubik',Arial,Helvetica,sans-serif">
                                                                                        <span
                                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;line-height:180%">This
                                                                                            code expires on</span><span
                                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-size:16px;line-height:180%;font-weight:400">
                                                                                            ${Token.expToTimestamp(Token.getPayload(token).exp)}</span></div>
                                                                                    <div
                                                                                        style="text-align:left;text-align-last:left">
                                                                                        <br></div>
                                                                                    <div
                                                                                        style="text-align:left;text-align-last:left;font-family:'Rubik',Arial,Helvetica,sans-serif">
                                                                                        <span
                                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;line-height:180%">If
                                                                                            you do not recognize this
                                                                                            request, please ignore this
                                                                                            email and delete it. If you
                                                                                            need further assistance,
                                                                                            please contact our support
                                                                                            team.</span></div>
                                                                                    <div
                                                                                        style="text-align:left;text-align-last:left">
                                                                                        <br></div>
                                                                                    <div
                                                                                        style="text-align:left;text-align-last:left;font-family:'Rubik',Arial,Helvetica,sans-serif">
                                                                                        <span
                                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;line-height:180%">Kind
                                                                                            regards,</span></div>
                                                                                    <div
                                                                                        style="text-align:left;text-align-last:left;font-family:'Rubik',Arial,Helvetica,sans-serif">
                                                                                        <span
                                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-weight:400;font-size:16px;line-height:180%">GJU
                                                                                            Jobs Team</span></div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table class="pc-component" style="width:600px;max-width:600px" width="600" align="center"
                                border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                    <td class="pc-w620-spacing-0-0-0-0" width="100%" border="0" cellspacing="0"
                                        cellpadding="0" role="presentation">
                                        <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0"
                                            role="presentation">
                                            <tr>
                                                <td valign="top" class="pc-w620-padding-40-30-30-30"
                                                    style="padding:40px;height:unset;background-color:transparent"
                                                    bgcolor="transparent">
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td valign="top" style="padding:40px 0 60px">
                                                                <table width="100%" border="0" cellpadding="0"
                                                                    cellspacing="0" role="presentation" align="center"
                                                                    style="margin:auto">
                                                                    <tr>
                                                                        <td valign="top"
                                                                            style="line-height:1px;font-size:1px;border-bottom:1px solid #d3d3d3">
                                                                            &nbsp;</td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td align="center" valign="top"
                                                                style="padding:7px 0 50px;height:auto">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                    role="presentation" width="100%"
                                                                    style="margin-right:auto;margin-left:auto">
                                                                    <tr>
                                                                        <td valign="top" align="center">
                                                                            <div class="pc-font-alt"
                                                                                style="text-decoration:none">
                                                                                <div
                                                                                    style="font-size:14px;line-height:180%;text-align:center;text-align-last:center;color:#9d9d9d;font-family:'Rubik',Arial,Helvetica,sans-serif;font-style:normal;letter-spacing:0">
                                                                                    <div
                                                                                        style="font-family:'Rubik',Arial,Helvetica,sans-serif">
                                                                                        <span
                                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-weight:400;font-size:14px;line-height:180%">A
                                                                                            project developed by
                                                                                            Hochschule für Technik und
                                                                                            Wirtschaft Berlin (HTW
                                                                                            Berlin) – University of
                                                                                            Applied Sciences</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                        role="presentation">
                                                        <tr>
                                                            <td align="center" valign="top"
                                                                style="padding:0 0 11px;height:auto">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                    role="presentation" width="100%"
                                                                    style="margin-right:auto;margin-left:auto">
                                                                    <tr>
                                                                        <td valign="top" align="center">
                                                                            <div class="pc-font-alt"
                                                                                style="text-decoration:none">
                                                                                <div
                                                                                    style="font-size:14px;line-height:20px;text-align:center;text-align-last:center;color:#9d9d9d;font-family:'Rubik',Arial,Helvetica,sans-serif;font-style:normal;letter-spacing:-0.2px">
                                                                                    <div
                                                                                        style="font-family:'Rubik',Arial,Helvetica,sans-serif">
                                                                                        <span
                                                                                            style="font-family:'Rubik',Arial,Helvetica,sans-serif;font-weight:400;font-size:14px;line-height:20px">Wilhelminenhofstraße
                                                                                            75A • 12459 Berlin •
                                                                                            Germany</span></div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
    `;
    sendEmail(EMailSender.NoReply, email, "Account Recovery Request", content);
};