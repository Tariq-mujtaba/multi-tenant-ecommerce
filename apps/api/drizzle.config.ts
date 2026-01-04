import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI is not set in environment variables');
}

export default {
  schema: './apps/api/src/db/schema',
  out: './apps/api/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URI,
  },
} satisfies Config;
