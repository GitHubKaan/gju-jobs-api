import express from "express";
import path from "path";
import cors from "cors";
import { getFrontendOrigin } from "./envReader.util";
import { app } from "../Main";
import { StatusCodes } from "http-status-codes";

/**
 * CORS handler settings
 */
export function CORSHandler() {
    const corsOptions = {
        origin: `${getFrontendOrigin()}`,
        credentials: true,
        methods: "GET, PATCH, PUT, POST, DELETE",
        optionsSuccessStatus: StatusCodes.OK,
        exposedHeaders: ["Authentication", "Authorization"]
    };
    
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
}