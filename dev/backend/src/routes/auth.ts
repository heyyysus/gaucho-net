import Express, { response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TOKEN_SECRET } from '../secret.json';
import { query } from '../db';
import bcrypt from 'bcrypt';


/**
 * Generates Access Token
 * @param userId userId to authenticate
 */
const generateToken = (userId: string) => {
    const ts = Date();
    const accessToken = jwt.sign({ 
        session: {
            userId: userId, 
            issued: ts,
        } 
        }, TOKEN_SECRET);
    return accessToken;
};

/**
 * User Model
 */
export interface User {
    user_id: number          //Primary Key
    email: string,
    u_name: string,
    hash?: string,
    createdAt: Date,
    lastUpdatedAt: Date,
};

const AuthRouter = Express.Router();

/** 
 * Login Function
 */
interface postLoginRequest extends Express.Request{
    body: {
        form: {
            username: string,
            plainTextPwd: string,
        }
    },
};
AuthRouter.post("/login", (req: postLoginRequest, res: Express.Response) => {
    try { 
        const { username, plainTextPwd } = req.body.form; 
        if(!username || !plainTextPwd ) throw new Error("All fields required");

        /**
         * Query Users
         */
        const queryStr = "SELECT * FROM users WHERE u_name=$1 LIMIT 1";
        query(queryStr, [username])
            .then(result => {
                if(result.rows.length === 1){
                    const { user_id, hash } = result.rows[0];
                    bcrypt.compare(plainTextPwd, hash)
                        .then(value => {
                            if(value)
                                res.json({
                                    token: generateToken(user_id),
                                });
                            else 
                                res.status(401).json({ error: "Invalid credentials" });
                        })
                        .catch(err => {throw err});
                } else res.status(401).json({error: "User not found"});
            })
            .catch(err => { throw err });
    }
    catch(e: any) {
        console.log(`Error: ${e.message}`);
        res.status(400).json({ error: "Bad request" });
    }
});

/**
 * Register Function 
 */
interface postRegisterRequest extends Express.Request {
    body: {
        form: {
            username: string,
            plainTextPwd: string,
            email: string,
        }
    }
};
AuthRouter.post('/register', (req: postRegisterRequest, res: Express.Response) => {
    try {
        const {username, plainTextPwd, email} = req.body.form;
        if (!username || !plainTextPwd || !email) throw Error("Incomplete Fields");
        query("SELECT * FROM users WHERE u_name=$1 OR email=$2 LIMIT 1", [username, email])
            .then(result => {
                if(result.rows.length > 0){
                    const { u_name, email } = result.rows[0];
                    if(u_name === username) res.status(409).json({ error: "Username already in use." });
                    else res.status(409).json({ error: "Email already in use." });
                } 
                else {
                    bcrypt.hash(plainTextPwd, 10)
                        .then(hash => {
                            query("INSERT INTO users (u_name, email, hash, createdAt, updatedAt)  VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *", 
                            [username, email, hash])
                            .then(result => {
                                res.json(result.rows[0]);
                            })
                            .catch(err => { throw err; });
                        })
                        .catch(err => { throw err });
                }
            })
            .catch(err => { throw err });
            
    }
    catch (e: any){
        console.log(`Error: ${e}`);
        res.status(400).json({ error: "Bad request" });
    }
});

export default AuthRouter;