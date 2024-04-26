import { DB_DATABASE, DB_PASSWORD, DB_USER, DB_LOCALHOST } from './config.js';
import mysql2 from 'mysql2/promise';


export const pool = mysql2.createPool({
    host: DB_LOCALHOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
});