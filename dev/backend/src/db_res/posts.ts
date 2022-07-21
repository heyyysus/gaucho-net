import { query } from './db';

export interface IPost {
    post_id: number,
    user_id: number,
    u_name: string,
    body: string,
    likes: number[],
    replies: number[],
    createdAt: string,
};


/**
 * 
 * @param id post_id to fetch
 * @returns post with post_id
 */
export const get_by_id = async(id: number): Promise<IPost | null> => {
    try {
        const sqlQuery = `SELECT p.post_id, u.user_id, u.u_name, p.body, p.createdAt FROM posts p
                        JOIN users u ON u.user_id=p.user_id WHERE p.post_id=$1 LIMIT 1`;
        const result = await query(sqlQuery, [id]);
        if(result.rowCount === 0) throw new Error("post_id not found");
        const likes = await get_likes(id) || [];
        const replies = await get_replies(id) || [];
        return {
            ...result.rows[0],
            likes: likes,
            replies: replies,
        };
    }
    catch(error) {
        console.log(error);
        return null;
    }
}; 
/**
 * 
 * @param id minimum id
 * @param limit how many posts to return DEFAULT 25
 * @returns list of posts with post_id>=id, limited to limit from least to greatest
 */
export const get_gte = async(id: number, limit = 25): Promise<IPost[] | null> => {
    try {
        const sqlQuery = `SELECT p.post_id, u.user_id, u.u_name, p.body, p.createdAt FROM posts p
                        JOIN users u ON u.user_id=p.user_id WHERE p.post_id>=$1 LIMIT $2`;
        const result = await query(sqlQuery, [id, limit]);

        const posts = result.rows.map(async (row): Promise<IPost>=> {
            const likesPromise = get_likes(row.post_id);
            const repliesPromise = get_replies(row.post_id);
            const [likes, replies] = await Promise.all([likesPromise, repliesPromise]);
            return {
                ...row,
                likes: likes,
                replies: replies,
            };
        });
        const posts_resolved = await Promise.all(posts);
        return posts_resolved;
       
    }
    catch (error){
        console.log(error);
        return null;
    }
}
/**
 * 
 * @param id post_id
 * @returns list of replies (post_id) to post with post_id=id
 */
export const get_replies = async(id: number): Promise<number[] | null> => {
    try {
        const sqlQuery = `SELECT post_id FROM posts WHERE parent=$1`;
        const result = await query(sqlQuery, [id]);
        return result.rows.map(row => { return row.post_id });
    }
    catch(error){
        console.log(error);
        return null;
    }
};
/**
 * 
 * @param id post_id
 * @returns list of likes to post with post_id=id
 */
export const get_likes = async(id: number): Promise<number[] | null> => {
    try{
        const sqlQuery = `SELECT user_id FROM likes WHERE post_id=$1`;
        const result = await query(sqlQuery, [id]);
        return result.rows.map(row => { return row.user_id });
    }
    catch(error){
        console.log(error);
        return null;
    }
};