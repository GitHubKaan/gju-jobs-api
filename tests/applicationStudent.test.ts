import request from "supertest";
import { expect, test, describe } from "vitest";
import { Testing } from "../src/utils/testing.util";
import { app } from "../Main";
import { getBackendPath } from "../src/utils/envReader.util";

describe("Application Student", () => {
    let accessToken: string;

    test("[POST] Apply", async () => {
        accessToken = await Testing.createStudentAccessToken();
        const jobUUID = await Testing.createJob();        
        
        const response = await request(app)
            .post(`${getBackendPath()}/application/apply`)
            .set("Authorization", accessToken)
            .send({
                jobUUID: jobUUID,
                message: "I want to work here, really, really badly!!! I love your company!"
            });
        
        expect(response.status).toBe(200);
    });

    test("[GET] Retrieve Applications", async () => {
        const response = await request(app)
            .get(`${getBackendPath()}/application/retrieve/student`)
            .set("Authorization", accessToken);

        expect(response.status).toBe(200);
    });
});