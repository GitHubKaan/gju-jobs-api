import request from "supertest";
import { app } from "../../Main";
import { ENV, getBackendPath } from "./envReader.util";

export class Testing {
    /**
     * Create an account (and reset "accessToken")
     * @returns Access token
     */
    static async createStudentAccessToken(): Promise<string> {
        let authCode: string = "";
        let authToken: string = "";

        const signupResponse = await request(app)
            .post(`${getBackendPath()}/user/signup/student`)
            .send({
                email: `felix@${ENV.ALLOWED_STUDENT_DOMAIN ?? "example.com"}`,
                phone: "+490123456789",
                givenName: "Max",
                surname: "Mustermann",
                degree: "MSc Computer Science",
                program: "Program name",
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

    /**
     * Create an account (and reset "accessToken")
     * @returns Access token
     */
    static async createCompanyAccessToken(): Promise<string> {
        let authCode: string = "";
        let authToken: string = "";

        const signupResponse = await request(app)
            .post(`${getBackendPath()}/user/signup/company`)
            .send({
                email: "moritz@ifemsnochelsifhnxshg.com",
                phone: "+490123456789",
                company: "Mustermann GmbH",
                description: "This is a test description.",
                givenName: "Moritz",
                surname: "Mustermann",
                street: "Musterstraße",
                streetNumber: "11B",
                ZIPCode: 12105,
                city: "Berlin",
                country: "Germany",
                size: "100-500",
                industry: "IT"
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

    /**
     * Create a job
     * @returns jobUUID
     */
    static async createJob(): Promise<string> {
        const response = await request(app)
            .post(`${getBackendPath()}/jobs/create`)
            .set("Authentication", await Testing.createCompanyAccessToken())
            .send({
                title: "Software Architect",
                description: "Sell your time cheap and earn money with us!",
                tags: [1, 2, 3],
                location: "Berlin",
                position: "Senior",
                exp: 2000000000
            });
        
        return response.body.uuid;
    }
}