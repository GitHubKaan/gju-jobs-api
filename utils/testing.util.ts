import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { app } from "../Main";
import { getBackendPath } from "./envReader.util";

export class Testing {
    /**
     * Create an account (and reset "accessToken")
     * @returns Access token
     */
    static async createAccessToken(): Promise<string> {
        let authCode: string = "";
        let authToken: string = "";

        const signupResponse = await request(app)
            .post(`${getBackendPath()}/user/signup`)
            .send({
                email: `${uuidv4()}@maxsoftware.com`,
                givenName: "Max",
                surname: "Mustermann",
                company: "Mustermann GmbH",
                street: "Musterstraße",
                streetNumber: "11B",
                ZIPCode: 12105,
                city: "Berlin",
                country: "Germany",
                phone: "+490123456789"
            });

            authCode = signupResponse.body.authCode;
            authToken = signupResponse.headers.authentication;

        const authResponse = await request(app)
            .post(`${getBackendPath()}/user/auth`)
            .set("Authentication", authToken)
            .send({
                code: authCode
            });
        
        const accessToken = authResponse.headers.authorization.split(" ")[1];
        return accessToken;
    }

 
}