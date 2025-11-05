import { ENV } from "../utils/envReader.util";
import { Pool } from "pg";

export const DBPool = new Pool({
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    database: ENV.SCHEMA_NAME,
    max: ENV.DB_POOL_MAX * 1000,
    idleTimeoutMillis: ENV.DB_POOL_IDLE * 1000,
    connectionTimeoutMillis: ENV.DB_POOL_TIMEOUT * 1000
});