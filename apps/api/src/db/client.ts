import 'dotenv/config';

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { Logger } from '@nestjs/common';

const databaseUrl = process.env.DATABASE_URI;

if (!databaseUrl) {
  throw new Error('DATABASE_URI is not set in environment variables');
}

const sql = neon(databaseUrl);
export const db = drizzle(sql);

const logger = new Logger('DB');

export async function testConnection() {
  try {
    const result = await sql`select 1`;
    logger.log('Database connected successfully: ' + JSON.stringify(result));
  } catch (err) {
    logger.error('Database connection failed', err);
    process.exit(1);
  }
}
