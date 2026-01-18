import { afterAll, beforeAll } from "vitest";
import { TestingService } from "../src/services/testing.service";
import { deleteTestingFiles } from "../src/utils/file.util";

beforeAll(async () => {
    await TestingService.deleteTestingTables();
    deleteTestingFiles();
});

afterAll(async () => {
    await TestingService.deleteTestingTables();
    deleteTestingFiles();
});