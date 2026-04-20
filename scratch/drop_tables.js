const postgres = require('postgres');
require('dotenv').config();

const sql = postgres(process.env.DATABASE_URL);

async function dropTable() {
  try {
    await sql`DROP TABLE IF EXISTS transaction_items CASCADE;`;
    await sql`DROP TABLE IF EXISTS laptops CASCADE;`;
    await sql`DROP TABLE IF EXISTS transactions CASCADE;`;
    await sql`DROP TABLE IF EXISTS customers CASCADE;`;
    console.log('Tables dropped successfully.');
  } catch (err) {
    console.error('Error dropping tables:', err);
  } finally {
    process.exit(0);
  }
}

dropTable();
