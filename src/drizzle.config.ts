import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv'
dotenv.config({path: '.env'})

if(!process.env.DATABASE_URL){
  throw new Error("Missing database URL")
}

export default defineConfig({
  dialect: "postgresql",
  // schema: "./db/schema.ts",
  schema: "./src/db/schema.ts",
  out: "./src/drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: false
  },
  verbose: true,
  strict: true,
  tablesFilter: ["!migrations", "!sessions", "!cache", "!jobs", "!failed_jobs", "!job_batches", "!cache_locks"],
});