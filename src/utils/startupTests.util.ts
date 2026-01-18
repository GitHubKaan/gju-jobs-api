import { createIndividualTransport } from "../configs/nodeMailer.config";
import { EMailSender } from "../enums";
import { TestingService } from "../services/testing.service";
import { CONSOLE } from "./console.util";
import { ENV } from "./envReader.util";

/**
 * Different API-Startup tests
 */
export async function startupTests() {
    if (!ENV.STARTUP_TESTS) {
        CONSOLE.WARNING("Startup tests are disabled.")
        return;
    }

    await TestingService.checkDBStatus();
    await checkMailServer();
}

/**
 * Check if Mailserver is working
 */
async function checkMailServer() {
    const transport = createIndividualTransport(EMailSender.System);

    try {
        await transport.transporter.verify();
        CONSOLE.SUCCESS("Mailserver is online.");
    } catch (error: any) {
        CONSOLE.ERROR("Mailserver is offline or connection settings faulty.");
    }
}