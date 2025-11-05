import { UUID } from "crypto";
import express from "express";
import { TokenType } from "../enums/token.enum";

//Global types
declare global {
    namespace Express {
        interface Request {
            token: string;
            tokenType: TokenType;
            tokenExp: number;
            
            userUUID: UUID;
            authUUID: UUID;
        }
    }
}