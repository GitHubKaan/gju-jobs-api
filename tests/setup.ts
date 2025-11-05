import { afterAll, beforeAll } from "vitest";
import { TestingService } from "../services/testing.service";
import { deleteTestingFiles } from "../utils/file.util";

beforeAll(async () => {
    await TestingService.deleteTestingTables();
    deleteTestingFiles();
});

afterAll(async () => {
    await TestingService.deleteTestingTables();
    deleteTestingFiles();
});