import Express from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../secret.json';

export interface requireAuthRequest extends Express.Request {
    session?: {
        userId: string,
        issued: string,
    },
};

export interface SessionPayload extends jwt.JwtPayload {
    session: {
        userId: string,
        issued: string,
    }
};

const requireAuth = (req: requireAuthRequest, res: Express.Response, next: Express.NextFunction) => {
    try {
        const accessToken: string = req.get('X-ACCESS-TOKEN') || "";
        const { session } = <SessionPayload>jwt.verify(accessToken, TOKEN_SECRET); 
        if(session && session.userId) {
            req.session = session;
            return next();
        }
        else {
            console.log(session);
            throw new Error("invalid");
        } 
    }
    catch (e: any){
        if(e.message === "invalid")
            return res.status(403).json({ error: "Invalid token" });
        else
            return res.status(400).json({ error: "Bad request" });
    }
};

export default requireAuth;