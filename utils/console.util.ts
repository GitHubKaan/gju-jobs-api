import { ConsoleColor, NodeEnv } from "../enums";
import { ENV, getBackendOrigin } from "./envReader.util";

function getPrefix(message: string) {
    return message.includes('\n') ? '\n' : '';
}

function getMessage(message: string) {
    return message.replace(/\n/g, '');
}

export class CONSOLE {
    static readonly LOG = (message: string) => console.log(`${getPrefix(message)}[ LOG ] ${getMessage(message)}`);;
    static readonly SUCCESS = (message: string) => console.log(`${getPrefix(message)}${ConsoleColor.GREEN}[ LOG ] ${getMessage(message)} ${ConsoleColor.RESET}`);
    static readonly WARNING = (message: string) => console.log(`${getPrefix(message)}${ConsoleColor.YELLOW}[ WARNING ] ${getMessage(message)} ${ConsoleColor.RESET}`);
    static readonly ERROR = (message: string) => console.log(`${getPrefix(message)}${ConsoleColor.RED}[ ERROR ] ${getMessage(message)} ${ConsoleColor.RESET}`);
}

/**
 * @param success Startup successful
 */
export function startupLog(success?: boolean) {
    if (ENV.NODE_ENV === NodeEnv.Testing) return;

    if (success) {
        console.log();
        if (ENV.NODE_ENV === NodeEnv.Dev) CONSOLE.WARNING("Development build is currently running.");
        CONSOLE.SUCCESS("Compiled successfully! Server is running...");
        return;
    }

    console.log(`\nThis software is proprietary and confidential. Unauthorized use, reproduction, or distribution is strictly prohibited.\n`);
    console.log(`GJU Jobs API (v${ENV.VERSION})\nMade by Kaan, Dilan and Khanh\n`);
    console.log(`Endpoints: ${getBackendOrigin()}\n`);
}