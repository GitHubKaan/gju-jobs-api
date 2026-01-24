import request from "supertest";
import { expect, test, describe } from "vitest";
import { Testing } from "../src/utils/testing.util";
import { app } from "../Main";
import { getBackendPath } from "../src/utils/envReader.util";

describe("Application Company", () => {
    let accessToken: string;

    test("[GET] Retrieve Applicants", async () => {
        accessToken = await Testing.createCompanyAccessToken();

        const jobResponse = await request(app)
            .post(`${getBackendPath()}/jobs/create`)
            .set("Authentication", accessToken)
            .send({
                title: "Software Architect",
                description: "Sell your time cheap and earn money with us!",
                tags: [1, 2, 3],
                position: "Senior",
                exp: 2000000000
            });
        const jobUUID = jobResponse.body.uuid;

        const response = await request(app)
            .get(`${getBackendPath()}/application/retrieve/company`)
            .set("Authorization", accessToken)
            .send({ jobUUID });

        expect(response.status).toBe(200);
    });
});