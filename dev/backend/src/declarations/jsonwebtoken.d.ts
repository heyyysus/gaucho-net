import jwt from "jsonwebtoken";

declare module 'jsonwebtoken' {
    export interface SessionPayload extends jwt.JwtPayload {
        session: {
            userId: string,
            issued: string,
        }
    };
};