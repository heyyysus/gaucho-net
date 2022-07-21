import { query } from "./db";

interface IUser{
    user_id: number,
    u_name: string,
    followers: number[],
    following: number[],
    createdAt: string,
};

export const getById = async(id: number): Promise<IUser | null> => {
    try {
        if(isNaN(id)) throw new Error("Invalid param: id");
        const userQuery = `SELECT user_id, u_name, createdAt WHERE user_id=$1`;
        const userResult = await query(userQuery, [id]);
        if(userResult.rowCount === 0) return null;
        let user_row = userResult.rows[0];

        const followersQuery = `SELECT user_id FROM followers WHERE f_user_id=$1`;
        const followersResult = await query(followersQuery, [id]);

        const followingQuery = `SELECT f_user_id FROM followers WHERE user_id=$1`;
        const followingResult = await query(followingQuery, [id]);
        
        return {
            user_id: Number(user_row.user_id),
            u_name: user_row.u_name,
            followers: followersResult.rows.map(row => {return(Number(row.f_user_id))}),
            following: followingResult.rows.map(row => {return(Number(row.user_id))}),
            createdAt: user_row.createdAt,
        };
    }
    catch(error) {
        console.log(error);
        return null;
    }
};

export const follow = async(curr_user_id: number, id: number): Promise<boolean> => {
    try {
        if((await query("SELECT follower_id FROM followers WHERE user_id=$1 AND f_user_id=$2", [curr_user_id, id])).rowCount > 0)
            return false;
        const sqlQuery = `INSERT INTO followers (user_id, f_user_id) VALUES ($1, $2) RETURNING *`;
        const result = await query(sqlQuery, [curr_user_id, id]);
        return result.rowCount > 0;
    }
    catch (error){
        console.log(error);
        return false;
    }
};

export const unfollow = async(curr_user_id: number, id: number): Promise<boolean> => {
    try {
        const sqlQuery = `DELETE FROM followers WHERE user_id=$1, f_user_id=$2 RETURNING *`;
        const result = await query(sqlQuery, [curr_user_id, id]);
        return result.rowCount > 0;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};