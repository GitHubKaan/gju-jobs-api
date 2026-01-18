import request from "supertest";
import { expect, test, describe } from "vitest";
import path from "node:path";
import { Testing } from "../src/utils/testing.util";
import { FileType } from "../src/enums";
import { getBackendPath } from "../src/utils/envReader.util";
import { app } from "../Main";

describe("File", () => {
    let accessToken: string;
    let UUID: string;

    test("[POST] Upload file", async () => {
        accessToken = await Testing.createCompanyAccessToken();
        const filePath = path.join(__dirname, "../images", "placeholder.png");

        const response = await request(app)
            .post(`${getBackendPath()}/file?type=${FileType.ProfilePicture}`)
            .set("Authorization", accessToken)
            .attach("file", filePath);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("UUID");

        UUID = response.body.UUID;
    });

    test("[GET] Get files", async () => {
        const response = await request(app)
            .get(`${getBackendPath()}/files`)
            .set("Authorization", accessToken);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("files");
    });

    test("[GET] Get file", async () => {
        const response = await request(app)
            .get(`${getBackendPath()}/file?UUID=${UUID}`)
            .set("Authorization", accessToken);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("file");
    });

    test("[DELETE] Delete file", async () => {
        const response = await request(app)
            .delete(`${getBackendPath()}/file`)
            .set("Authorization", accessToken)
            .send({
                UUID: UUID
            });

        expect(response.status).toBe(200);
    });
});