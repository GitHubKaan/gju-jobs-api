import request from "supertest";
import { expect, test, describe } from "vitest";
import { Testing } from "../src/utils/testing.util";
import { app } from "../Main";
import { getBackendPath } from "../src/utils/envReader.util";

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
                description: "Cool position for nerds!!! Kâan was here!",
                tags: [1, 2],
                position: "Intern",
                exp: 2000000000
            });
                
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("uuid");

        jobUUID = response.body.uuid;
    });

    test("[PATCH] Update Job", async () => {
        const response = await request(app)
            .patch(`${getBackendPath()}/jobs/update`)
            .set("Authorization", accessToken)
            .send({
                jobUUID: jobUUID,
                title: "Senior Software Developer",
                description: "Cooler position i guess?!",
                tags: [69, 31, 32, 10, 20],
                position: "Senior",
                exp: 3000000000
            });
                
        expect(response.status).toBe(200);
    });

    test("[GET] Retrieve Jobs", async () => {
        const response = await request(app)
            .get(`${getBackendPath()}/jobs?tags=[1, 2, 3]&sort=NEWEST&page=1&pageSize=10`)
            .set("Authorization", accessToken)
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("companyInfo");
        expect(response.body).toHaveProperty("jobs");
    });

    test("[DELETE] Delete Job", async () => {
        const response = await request(app)
            .delete(`${getBackendPath()}/jobs/delete`)
            .set("Authorization", accessToken)
            .send({
                jobUUID: jobUUID
            });
    
        expect(response.status).toBe(200);
    });
});