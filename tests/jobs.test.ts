import request from "supertest";
import { expect, test, describe } from "vitest";
import { Testing } from "../utils/testing.util";
import { app } from "../Main";
import { getBackendPath } from "../utils/envReader.util";

describe("File", () => {
    let accessToken: string;
    let jobUUID: string;

    test("[POST] Create Job", async () => {
        accessToken = await Testing.createCompanyAccessToken();
        
        const response = await request(app)
            .post(`${getBackendPath()}/jobs/create`)
            .set("Authorization", accessToken)
            .send({
                title: "Software Developer",
                description: "Cool position for nerds!!! Kaan was here!",
                tags: [1, 2, 3],
                position: "Intern",
                exp: 2000000000
            });
                
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid");

        jobUUID = response.body.uuid;
    });
});