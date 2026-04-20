import { db } from '../db';
import { sql } from 'drizzle-orm';

async function run() {
  try {
    await db.execute(sql`TRUNCATE TABLE users CASCADE`);
    console.log('Truncated users table successfully.');
  } catch (e) {
    console.error('Truncation failed:', e);
  }
  process.exit(0);
}

run();
