import dotenv from 'dotenv';

dotenv.config();

export const DB_DATABASE = process.env.DB_DATABASE || 'miniproyecto';
export const DB_USER = process.env.DB_USER || 'user'; 
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_LOCALHOST = process.env.DB_LOCALHOST || 'localhost';
export const PORT = process.env.PORT || 3000;