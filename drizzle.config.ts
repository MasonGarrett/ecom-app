import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
    path: '.env.local',
});

export default defineConfig({
    dialect: 'postgresql', // "postgresql" | "mysql"
    schema: './server/schema.ts',
    out: './server/migrations', // "pg" | "ysql2" | "better-sqlite" | "libsql" | "turso"
    dbCredentials: {
        url: process.env.POSTGRES_URL!,
    },
});
