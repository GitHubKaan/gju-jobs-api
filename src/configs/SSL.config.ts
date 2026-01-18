import { ENV } from "../utils/envReader.util";
import path from "node:path";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import { CONSOLE } from "../utils/console.util";
import { app } from "../../Main";
import { NodeEnv } from "../enums";

/**
 * SSL/TSL (HTTP/HTTPS) configuration
 * @returns Server config
 */
export async function SSLHandler(): Promise<http.Server | https.Server> {
    //CORS settings
    let server: http.Server | https.Server;

    server = http.createServer(app); //HTTP connection

    if (!fs.existsSync("./certificates/cert.pem") || !fs.existsSync("./certificates/key.pem")) {
        CONSOLE.ERROR("SSL certification and/or key file is missing.");
        return server;
    }

    if (ENV.API_HTTPS) {
        const certPath = path.join(__dirname, "../certificates/cert.pem");
        const keyPath = path.join(__dirname, "../certificates/key.pem");
        
        /* 
            Bugfix for certification issue -- enable this and try if it will fix it
        
            https://www.npmjs.com/package/ssl-root-cas

            const rootCas = require("ssl-root-cas").create();
            rootCas.addFile(certPath);
            require("https").globalAgent.options.ca = rootCas;
         */

        const cert = fs.readFileSync(certPath, "ascii");
        const key = fs.readFileSync(keyPath, "ascii");

        const credentials = {
            key: key,
            cert: cert
        };

        try {
            const { validateSSL } = require("ssl-validator");
            await validateSSL(cert, { key: key /* Domain: www.example.com */ });

            const HTTPSServer: http.Server | https.Server = https.createServer(credentials, app); //HTTPs connection
            server = HTTPSServer;
        } catch (error: any) {
            if (ENV.NODE_ENV === NodeEnv.Production) {
                CONSOLE.ERROR("SSL certificate validation or format error detected on HTTPS/WSS.");
                console.error(error);
                process.exit(1);
            }

            CONSOLE.ERROR("SSL certificate validation or format error detected on HTTPS/WSS. Switching to HTTP/WS as fallback.");
            console.error(error);
        }
    }
    
    return server;
}