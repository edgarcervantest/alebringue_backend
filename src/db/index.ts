import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from 'dotenv'
dotenv.config({path: 'C:/Users/Dell Presicion 5530/Documents/alebringue_app/backend/.env'})


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);