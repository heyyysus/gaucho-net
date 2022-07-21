import { Pool, PoolConfig, QueryResult } from 'pg';
import { DB_CONFIG } from '../secret.json';

const poolConfig: PoolConfig = DB_CONFIG;

const pool = new Pool(poolConfig);

export const query = (text: string, params: any[]) => { 
    return pool.query(text, params);
}