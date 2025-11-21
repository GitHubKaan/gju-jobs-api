import request from "supertest";
import { expect, test, describe } from "vitest";
import { app } from "../Main";
import { Testing } from "../utils/testing.util";
import { getBackendPath } from "../utils/envReader.util";

describe("User", () => {
    let authToken: string;
    let accessToken: string;
    let recoveryToken: string;
    let deletionToken: string;
    let authCode: string;
    
    test("[POST] Signup", async () => {
        const response = await request(app)
            .post(`${getBackendPath()}/user/signup`)
            .send({
                email: "max@maxsoftware.com",
                givenName: "Max",
                surname: "Mustermann",
                company: "Mustermann GmbH",
                street: "Musterstraße",
                streetNumber: "11B",
                ZIPCode: 12105,
                city: "Berlin",
                country: "Germany",
                phone: "+490123456789",
                isStudent: true
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("authCode");
        expect(response.headers.authentication.split(" ")[0]).toMatch("Bearer");
    });

    test("[GET] Get user", async () => {
        accessToken = await Testing.createAccessToken();
        
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
                email: "max@maxsoftware.com"
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
                email: "max@maxsoftware.com"
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