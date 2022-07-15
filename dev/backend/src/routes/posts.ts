import Express from 'express';
import { query } from '../db';
import { requireAuthRequest } from '../middleware/requireAuth';

const PostsRouter = Express.Router();

/**
 * Get 25 Newest Posts from Following
 */
PostsRouter.get('/', (req: requireAuthRequest, res) => {
    const sqlQuery = `SELECT p.post_id, p.body, p.parent, p.isRoot, p.createdAt, p.updatedAt, u.u_name, u.user_id 
                    FROM posts p JOIN users u ON p.user_id=u.user_id JOIN followers f ON f.user_id=p.user_id AND f.f_user_id=$1
                    WHERE p.isRoot=TRUE
                    ORDER BY p.post_id DESC LIMIT 25;`;
    query(sqlQuery, [ req.session?.userId ])
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => { 
        console.log(err);
        res.status(500).json({ error: "Server error" })
    });
});
interface postPostsRequest extends requireAuthRequest {
    body: {
        form: {
            body: string,
        }
    },
};
PostsRouter.post('/', (req: postPostsRequest, res) => {
    try {
        const { body } = req.body.form;
        const userId = req.session?.userId;
        if(!userId) throw new Error("No userId");
        if(!body) throw new Error("No body");
        const sqlQuery = `INSERT INTO posts (user_id, body, createdAt, updatedAt)
                            VALUES ($1, $2, NOW(), NOW()) RETURNING post_id, user_id, body, createdAt, updatedAt`;
        query(sqlQuery, [userId, body])
        .then(result => {
            res.json(result.rowCount > 0 && result.rows[0]);
        })
        .catch(err => { console.log(err); res.status(500).json({ error: "Server error" }); });
    } 
    catch(err: any) {
        console.log(err);
        res.status(400).json({ error: "Bad request" });
    }
});
/**
 * Get single post by id
 */
PostsRouter.get('/:post_id/:range', (req: requireAuthRequest, res) => {
    const post_id = Number(req.params.post_id);
    const range = Number(req.params.range);
    const userId = req.session?.userId;
    if (!userId) res.status(400).json({ error: "Bad request" });
    if(isNaN(post_id) || isNaN(range)) res.status(400).json({ error: "Bad request" });
    let conditional: string;
    const dir: boolean = (range >= 0);
    if(dir) 
        conditional = `p.post_id >= ${post_id}`;
    else 
        conditional = `p.post_id <= ${post_id}`;
    
    const sqlQuery = `SELECT p.post_id, p.body, p.parent, p.isRoot, p.createdAt, p.updatedAt, u.u_name, u.user_id
                    FROM posts p JOIN users u ON p.user_id=u.user_id JOIN followers f ON f.user_id=p.user_id AND f.f_user_id=$2
                    WHERE ${conditional} ORDER BY p.post_id ${!dir ? "DESC" : ""} LIMIT $1`;
    console.log(sqlQuery);
    query(sqlQuery, [ Math.abs(range)+1, userId ])
    .then(result => {
        if(result.rowCount === 0 )
            res.status(404).json({ error: "Not found" });
        else 
            res.json(result.rows);
    })
    .catch(err => res.status(400).json( {err: err.message}));
});

export default PostsRouter;