import process from 'node:process';
import { drizzle } from 'drizzle-orm/mysql2';
import 'dotenv/config';
import mysql from 'mysql2/promise';
import { migrate } from 'drizzle-orm/connect';
import drizzleConfig from '../drizzle.config';

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL as string);

  // This will run migrations on the database, skipping the ones already applied
  await migrate(drizzle(connection), { migrationsFolder: drizzleConfig.out });

  // Don't forget to close the connection, otherwise the script will hang
  await connection.end();
}

main();
