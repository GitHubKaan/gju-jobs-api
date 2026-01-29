import bodyParser from "body-parser";
import express from "express";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import { SSLHandler } from "./src/configs/SSL.config";
import { errorHandler, notFoundHandler } from "./src/middlewares/error.middleware";
import { BlacklistService } from "./src/services/blacklist.service";
import { CONSOLE, startupLog } from "./src/utils/console.util";
import { CORSHandler } from "./src/utils/CORS.util";
import { ENV } from "./src/utils/envReader.util";
import { createUploadFolder, deleteUnnusedUploadFolders } from "./src/utils/file.util";
import { runRedis } from "./src/utils/redis.util";
import { routerHandler } from "./src/utils/router.util";
import { startupTests } from "./src/utils/startupTests.util";
import { NodeEnv } from "./src/enums";
import { timeout } from "./src/middlewares/timeout.middleware";

export const app = express();
export let server: http.Server | https.Server;

async function startServer() {
    if (fs.existsSync("./.env") && fs.existsSync("./.env.testing") && fs.existsSync("./.env.production")) {
        startupLog();
        if (ENV.NODE_ENV !== NodeEnv.Testing) await startupTests();
        await runRedis();
        startupLog(true);
        
        createUploadFolder();

        if (ENV.REMOVE_UNNUSED_FOLDERS) deleteUnnusedUploadFolders();
        
        // Request limits
        app.use(bodyParser.json({ limit: `${ENV.MAX_CONTENT_SIZE}kb` }));
        app.use(bodyParser.urlencoded({ limit: `${ENV.MAX_CONTENT_SIZE}kb`, extended: true }));
        
        server = await SSLHandler();
        CORSHandler();
        
        timeout(server); // If requests that take too long (needs to be up here)

        routerHandler();
        
        app.use(errorHandler); // Normal & Internal errors
        app.use(notFoundHandler); // Path not found
        
        setInterval(BlacklistService.cleanupBlacklistedTokens, ENV.BLACKLIST_CLEANUP_INTERVAL * 1000); // Database auto-clear entries
    
        server.listen(ENV.API_PORT, () => {});
    } else {
        CONSOLE.ERROR("One or multiple .env files are missing. (.env, .env.production, .env.testing is required)");
        process.exit(1);
    }
}

startServer();
