import { UUID } from "node:crypto";
import { UpdateUserCompanyType, UserCompanyType } from "../types/user.type";
import { PoolClient } from "pg";
import { DBPool } from "../configs/postgreSQL.config";
import { encrypt } from "../utils/encryption.util";
import { DefaultError } from "../utils/error.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE, TITLE } from "../../responseMessage";
import { v4 as uuidv4 } from "uuid";
import { UserCompanyQueries } from "../queries/userCompany.queries";

export class UserCompanyService {
    /**
     * Add new company user
     * @param payload Signup payload
     * @returns UUID (userUUID) & authUUID
     * @throws {DefaultError} Already existing email
    */
    static async add(
        payload: UserCompanyType,
    ): Promise<{
        UUID: UUID,
        authUUID: UUID
    }> {
        const client: PoolClient = await DBPool.connect();

        const UUID: UUID = uuidv4() as UUID;
        const authUUID: UUID = uuidv4() as UUID;

        const result = await client.query(UserCompanyQueries.add, [
            UUID,
            authUUID,
            payload.email,
            payload.phone ? encrypt(payload.phone) : null,
            encrypt(payload.company.trim()),
            payload.description ? encrypt(payload.description.trim()) : null,
            encrypt(payload.givenName.trim()),
            encrypt(payload.surname.trim()),
            encrypt(payload.street.trim()),
            encrypt(payload.streetNumber.trim()),
            encrypt(String(payload.ZIPCode).trim()),
            encrypt(payload.city.trim()),
            encrypt(payload.country.trim()),
            encrypt(payload.size.trim()),
            encrypt(payload.industry.trim())
        ]);

        if (result.rowCount === 0) {
            throw new DefaultError(
                StatusCodes.CONFLICT,
                MESSAGE.ERROR.DUPLICATE(TITLE.E_MAIL_ADDRESS)
            );
        }

        return { UUID, authUUID }
    };

    /**
     * Update user data
     * @param userUUID userUUID
     * @param payload UpdateUser
    */
    static async update(
        userUUID: UUID,
        payload: UpdateUserCompanyType
    ): Promise<
        void
    > {
        if (!payload) throw new DefaultError(StatusCodes.NOT_MODIFIED, "No values provided to update.");

        const fieldsToUpdate = {
            phone: payload.phone?.trimEnd().trimStart(),
            company: payload.company?.trimEnd().trimStart(),
            description: payload.description?.trimEnd().trimStart(),
            given_name: payload.givenName?.trimEnd().trimStart(),
            surname: payload.surname?.trimEnd().trimStart(),
            street: payload.street?.trimEnd().trimStart(),
            street_number: payload.streetNumber?.trimEnd().trimStart(),
            zip_code: String(payload.ZIPCode)?.trimEnd().trimStart(),
            city: payload.city?.trimEnd().trimStart(),
            country: payload.country?.trimEnd().trimStart(),
            industry: payload.industry?.trimEnd().trimStart(),
            size: payload.industry?.trimEnd().trimStart(),
        };

        const optionalClauses: string[] = [];
        const values: any[] = [userUUID]; //First value ($1) is User UUID

        Object.entries(fieldsToUpdate).forEach(([field, value]) => {
            if (value) {
                optionalClauses.push(`${field} = $${optionalClauses.length + 2}`);
                values.push(encrypt(value));
            }
        });
        const joinedOptionalClauses = optionalClauses.join(", ");

        await DBPool.query(UserCompanyQueries.update(joinedOptionalClauses), values);
    }
}