import request from "supertest";
import { expect, test, describe } from "vitest";
import { app } from "../Main";
import { getBackendPath } from "../src/utils/envReader.util";

describe("General", () => {
    test("[POST] Support", async () => {
        const response = await request(app)
            .post(`${getBackendPath()}/support`)
            .send({
                email: "max@dwightnslsguebhyds.com",
                phone: "+490123456789",
                type: "LEGAL",
                message: "Hey, I need help!"
            });

        expect(response.status).toBe(200);
    });

    test("[POST] Send frontend error", async () => {
        const response = await request(app)
            .post(`${getBackendPath()}/send-frontend-error`)
            .send({errorMessage: "This is a test error message."});

        expect(response.status).toBe(200);
    });
});