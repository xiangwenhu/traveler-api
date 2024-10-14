import { users } from '@/schema/user';
import { db } from '@/utils/db';

export async function getAllUsers() {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
    })
    .from(users);
}
