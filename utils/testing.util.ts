import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { app } from "../Main";
import { ENV, getBackendPath } from "./envReader.util";

export class Testing {
    /**
     * Create an account (and reset "accessToken")
     * @returns Access token
     */
    static async createAccessToken(): Promise<string> {
        let authCode: string = "";
        let authToken: string = "";

        const signupResponse = await request(app)
            .post(`${getBackendPath()}/user/signup/student`)
            .send({
                email: `felix@${ENV.ALLOWED_STUDENT_DOMAIN}`,
                phone: "+490123456789",
                givenName: "Max",
                surname: "Mustermann",
                birthdate: "1995-06-15",
                degree: "MSc Computer Science",
                tags: [1, 2, 3],
                jobPreferences: [1, 2, 3],
                languages: [1, 2, 3]
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