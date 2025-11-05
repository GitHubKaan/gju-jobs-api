import { InternalErrorService } from "../services/internalError.service";
import { CONSOLE } from "../utils/console.util";
import { getCurrentTimestamp } from "../utils/time.util";
import { UUID } from "crypto";
import { stringify } from "flatted";

/**
 * Internal error handler (Not a Promise)
 * @param cause Error cause
 * @param serialize Serialize error?
 * @param backend Backend or frontend error? (if backend then true)
 * @return errorUUID
*/
export async function addInternalError(
    cause: any,
    serialize: boolean,
    backend: boolean
): Promise<UUID> {
    try {
        if (!cause || cause.trim === "") {
            throw Error();
        }
        
        // Serialize error?
        let serializedCause: string;
        if (serialize) {
            serializedCause = serializeError(cause);
        } else {
            serializedCause = cause;
        }
        
        const limitedCauseLength = serializedCause.slice(0, 10000);

        const isDuplicate: UUID | undefined = await InternalErrorService.isDuplicate(limitedCauseLength);

        let errorUUID: UUID;
        if (isDuplicate) {
            errorUUID = isDuplicate;
        } else {
            errorUUID = await InternalErrorService.create(limitedCauseLength, backend);
        }

        if (backend) {
            CONSOLE.ERROR(`An internal (backend) error occurred on the ${getCurrentTimestamp()}, with the UUID ${errorUUID}`);
            console.error(cause);
        }
        
        return errorUUID;
    } catch (error: any) {
        CONSOLE.ERROR(`Could not add internal error to the database. (Error: ${error})`);
        return `${"00000000"}-${"0000"}-${"0000"}-${"0000"}-${"000000000000"}`; //Placeholder
    }
}

/**
 * Error message serializer
 * @param error Error
 * @returns Error properties
 */
export function serializeError(error: any): string {
    if (typeof error === "string") { // If just normal string error
        return error;
    }

    // Read out all error properties on "normal" internal error
    const plainObject: any = {};
    Object.getOwnPropertyNames(error).forEach((key) => {
        plainObject[key] = error[key];
    });

    return stringify(plainObject);
}