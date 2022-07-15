import Express, { json } from 'express';
import { requireAuthRequest } from '../middleware/requireAuth';
import { User } from './auth';
import { query } from '../db';
import e from 'express';

const UsersRouter = Express.Router();

UsersRouter.get("/:user_id", (req: requireAuthRequest, res: Express.Response) => {
    const user_id_str: string = req.params.user_id;
    try {
        const user_id = Number(user_id_str);
        if(isNaN(user_id)) throw new Error(":user_id NaN");
        query("SELECT * FROM users WHERE user_id=$1 LIMIT 1", [user_id])
        .then(result => {
            if(result.rowCount === 0){
                res.status(404).json({ error: "Not found." });
            } else {
                const user: User = result.rows[0];
                user.hash = undefined;
                res.json(user);
            }
        })
        .catch(err => { throw err });
    }
    catch (e: any) {
        console.log(e.message);
        res.status(400).json({ error: "Invalid request" });
    }
});

/**
 * action: {'follow', 'unfollow'}
 */
interface postUserIdRequest extends requireAuthRequest {
    body: {
        action: string,
    }
};
UsersRouter.post("/:user_id/", (req: postUserIdRequest, res) => {
    try {
        const { action } = req.body;
        const _user_id = req.session?.userId;
        const o_user_id = req.params.user_id;
        if(!_user_id || !o_user_id || !o_user_id) throw new Error("Invalid session");
        
        switch(action){
            case 'follow':
                query("SELECT * FROM followers WHERE user_id=$1 AND f_user_id=$2 LIMIT 1", [o_user_id, _user_id])
                .then(result => {
                    if(result.rowCount > 0){
                        res.json(result.rows[0]);
                    } else{
                        const sqlQuery = `INSERT INTO followers (user_id, f_user_id, createdAt) 
                            VALUES ($1, $2, NOW()) RETURNING *`;
                        query(sqlQuery, [o_user_id, _user_id])
                        .then(result => {
                            if(result.rowCount > 0){
                                res.json(result.rows[0]);
                            } else
                                res.status(500).json({ error: "Server error" });
                        })
                        .catch(err => { throw err; });
                    }
                })
                .catch(err => { throw err });
            break;
            
            case 'unfollow':
                const sqlQuery = `DELETE FROM followers WHERE user_id=$1 AND f_user_id=$2 RETURNING *`;
                query(sqlQuery, [o_user_id, _user_id])
                .then(result => {
                    if(result.rowCount === 0) {
                        res.status(200).json({ message: "No action" });
                    } else {
                        res.json(result.rows[0]);
                    }
                })
                .catch(err => { throw err; });
            
            break;

            default:
            throw new Error("Invalid action");
        }
    }
    catch (err: any) {
        console.log(err);
        res.status(400).json({error: "Bad request"});
    }
});

export default UsersRouter;