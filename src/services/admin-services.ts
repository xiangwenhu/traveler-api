import { users } from '@/schema/user';
import { db } from '@/utils/db';

export async function getAllUsers() {
  return await db
    .select()
    .from(users);
}
