import process from 'node:process';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as userSchame from "../schema/user";
import * as resourceSchame from "../schema/resource";
import * as travelSchame from "../schema/travel";

const poolConnection = mysql.createPool(process.env.DATABASE_URL as string);

export const db = drizzle(poolConnection, {
    mode: 'default', schema: {
        ...userSchame,
        ...resourceSchame,
        ...travelSchame
    }
});
