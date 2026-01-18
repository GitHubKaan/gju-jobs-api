import { Request, Response } from "express";
import http from "node:http";
import https from "node:https";
import { Socket } from "node:net";
import { MESSAGE } from "../../responseMessage";
import { ENV } from "../utils/envReader.util";

/**
 * Timeout service (For HTTP-Endpoints)
 * @param server Server
 */
export function timeout(server: http.Server | https.Server) {
    server.on("request", (req: Request, res: Response) => {
        let requestTimeout = ENV.GLOBAL_TIMEOUT; //Global timeout

        //Individual timeouts
        if (req.url === `/${ENV.IMAGE_UPLOAD_PATH}`) {
            requestTimeout = ENV.UPLOAD_IMAGES_TIMEOUT;
        }

        req.setTimeout(requestTimeout * 1000, () => {});
    });
    
    const timeoutMessage = JSON.stringify({ description: MESSAGE.ERROR.TIMEOUT });
    server.on("timeout", (socket: Socket) => { // Socket is the connection type (No relations to WebSockets)
        socket.write("HTTP/1.1 408 Request Timeout\r\n");
        socket.write("Content-Type: application/json\r\n");
        socket.write("Connection: close\r\n");
        socket.write(`Content-Length: ${Buffer.byteLength(timeoutMessage)}\r\n`);
        socket.write('\r\n');
        socket.write(timeoutMessage);
        
        socket.destroy();
    });
}