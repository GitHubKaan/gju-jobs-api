import request from "supertest";
import { expect, test, describe } from "vitest";
import { app } from "../Main";
import { Testing } from "../src/utils/testing.util";
import { ENV, getBackendPath } from "../src/utils/envReader.util";

describe("User", () => {
    let authToken: string;
    let accessToken: string;
    let recoveryToken: string;
    let deletionToken: string;
    let authCode: string;
    test("[POST] Signup Student", async () => {
        const response = await request(app)
        .post(`${getBackendPath()}/user/signup/student`)
        .send({
            email: `max@${ENV.ALLOWED_STUDENT_DOMAIN ?? "example.com"}`,
            phone: "+490123456789",
            givenName: "Max",
            surname: "Mustermann",
            degree: "MSc Computer Science",
            program: "Program name",
            tags: [1, 2, 3],
            jobPreferences: [1, 2, 3],
            languages: [1, 2, 3]
        });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("authCode");
        expect(response.headers.authentication.split(" ")[0]).toMatch("Bearer");
    });

    test("[POST] Signup Company", async () => {
        const response = await request(app)
        .post(`${getBackendPath()}/user/signup/company`)
        .send({
            email: "max@geisuvntbhgusbxf.com",
            phone: "+490123456789",
            company: "Mustermann GmbH",
            description: "This is a test description.",
            givenName: "Max",
            surname: "Mustermann",
            street: "Musterstraße",
            streetNumber: "11B",
            ZIPCode: 12105,
            city: "Berlin",
            country: "Germany",
            size: "100-500",
            industry: "IT"
        });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("authCode");
        expect(response.headers.authentication.split(" ")[0]).toMatch("Bearer");
    });

    test("[GET] Get user", async () => {
        accessToken = await Testing.createStudentAccessToken();
        
        const response = await request(app)
            .get(`${getBackendPath()}/user`)
            .set("Authorization", accessToken);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("user");
    });

    test("[GET] Get recovery", async () => {
        const response = await request(app)
            .get(`${getBackendPath()}/user/recovery`)
            .send({
                email: `max@${ENV.ALLOWED_STUDENT_DOMAIN ?? "example.com"}`,
            });

        expect(response.status).toBe(200);
        expect(response.headers.authentication.split(" ")[0]).toMatch("Bearer");

        recoveryToken = response.headers.authentication;
    });

    test("[POST] Recovery", async () => {
        const response = await request(app)
            .post(`${getBackendPath()}/user/recovery`)
            .set("Authentication", recoveryToken);

        expect(response.status).toBe(200);
    });

    test("[POST] Login", async () => {
        const response = await request(app)
            .post(`${getBackendPath()}/user/login`)
            .send({
                email: `max@${ENV.ALLOWED_STUDENT_DOMAIN ?? "example.com"}`,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("authCode");
        expect(response.headers.authentication.split(" ")[0]).toMatch("Bearer");

        authToken = response.headers.authentication;
        authCode = response.body.authCode;
    });

    test("[POST] Authentication", async () => {
        const response = await request(app)
            .post(`${getBackendPath()}/user/auth`)
            .set("Authentication", authToken)
            .send({
                code: authCode
            });

        expect(response.status).toBe(200);
        expect(response.headers.authorization.split(" ")[0]).toMatch("Bearer");

        accessToken = response.headers.authorization;
    });

    test("[PATCH] Patch user", async () => {
        const response = await request(app)
            .patch(`${getBackendPath()}/user/update`)
            .set("Authorization", accessToken)
            .send({
                phone: "+490123456789",
                company: "Mustermann GmbH",
                description: "This is a test description.",
                givenName: "Max",
                surname: "Mustermann",
                street: "Musterstraße",
                streetNumber: "11B",
                ZIPCode: 12105,
                city: "Berlin",
                country: "Germany",
                size: "100-500",
                industry: "IT"
            });

        expect(response.status).toBe(200);
    });

    test("[GET] Get delete user", async () => {
        const response = await request(app)
            .get(`${getBackendPath()}/user/deletion`)
            .set("Authentication", accessToken);

        expect(response.status).toBe(200);
        expect(response.headers.authentication.split(" ")[0]).toMatch("Bearer");

        deletionToken = response.headers.authentication;
    });

    test("[DELETE] Delete user", async () => {
        const response = await request(app)
            .delete(`${getBackendPath()}/user/deletion`)
            .set("Authentication", deletionToken);

        expect(response.status).toBe(200);
    });
});