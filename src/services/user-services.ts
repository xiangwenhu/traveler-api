import { Buffer } from 'node:buffer';
import process from 'node:process';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { type NewUser, type UpdateUser, type User, users } from '../schema/user';
import { db } from '../utils/db';
import { BackendError } from '../utils/errors';
import type { PagerParams } from '../types/service';

export async function getUserByUserId(userId: number) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user;
}

export async function getUserByAccount(account: string) {
  const [user] = await db.select().from(users).where(eq(users.account, account)).limit(1);
  return user;
}

export async function addUser(user: NewUser) {
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

export async function deleteUser(id: number) {
  const user = await getUserByUserId(id);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  const [deletedUser] = await db.delete(users).where(eq(users.id, id));
  return deletedUser;
}

export async function updateUser({ name, email, password, status, id }: UpdateUser) {
  const upUser: UpdateUser = {
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

export async function getUsers(pager: PagerParams) {
  const offset = (pager.pageNum - 1) * pager.pageSize;

  const usersList = await db.select({}).from(users).offset(offset).limit(pager.pageSize); ;
  return usersList;
}
