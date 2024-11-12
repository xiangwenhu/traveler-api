import { count } from 'drizzle-orm';
import { users } from '../schema/user';
import { db } from '../utils/db';

export async function getItems() {
  const whereCon = {};

  const totalArr = await db.select({ count: count() }).from(users);

  const items = await db
    .select({
      account: users.account,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      status: users.status,
      updatedAt: users.updatedAt,
      isAdmin: users.isAdmin,
      id: users.id,
    })
    .from(users);

  return {
    list: items,
    total: totalArr[0]?.count || 0,
  };
}
