import process from 'node:process';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/*',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
