import { buildWhereClause } from '@/utils/sql';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { type NewItemType, SelectItemsType, type UpdateItemType, users } from '../schema/user';
import { db } from '../utils/db';
import { BackendError } from '../utils/errors';

export async function getUserByUserId(userId: number) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user;
}

export async function getUserByAccount(account: string) {
  const [user] = await db.select().from(users).where(eq(users.account, account)).limit(1);
  return user;
}

export async function addItem(user: NewItemType) {
  const { password } = user;
  const hashedPassword = await argon2.hash(password, {
    salt: Buffer.from(process.env.ARGON_2_SALT as string),
  });

  const [newUser] = await db
    .insert(users)
    .values({
      ...user,
      password: hashedPassword,
    });

  if (!newUser) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to add user',
    });
  }

  return newUser;
}

/**
 * 邮件激活
 * @param email
 */
export async function verifyUser(_email: string) {
  // const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  // if (!user) {
  //   throw new BackendError('USER_NOT_FOUND');
  // }
  return true;
}

export async function deleteItem(id: number) {
  const user = await getUserByUserId(id);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  const [deletedUser] = await db.delete(users).where(eq(users.id, id));
  return deletedUser;
}

export async function updateItem({ name, email, password, status, id }: UpdateItemType) {
  const upUser: UpdateItemType = {
    name,
    email,
    status,
  };
  if (password) {
    const hashedPassword = await argon2.hash(password, {
      salt: Buffer.from(process.env.ARGON_2_SALT as string),
    });
    upUser.password = hashedPassword;
  }

  const [updatedUser] = await db
    .update(users)
    .set(upUser)
    .where(eq(users.id, id!));
  if (!updatedUser) {
    throw new BackendError('USER_NOT_FOUND', {
      message: 'User could not be updated',
    });
  }

  return updatedUser;
}


export async function getItems(query: SelectItemsType) {
  const { pageNum, pageSize, ...conditions} = query;
  const offset = (+pageNum! - 1) * +pageSize!;

  const whereCon = buildWhereClause(conditions, users);

  const usersList = await db.select()
  .from(users)
  .where(whereCon)
  .offset(offset)
  .limit(+pageSize!);
  return usersList;
}

