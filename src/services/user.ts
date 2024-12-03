import { Buffer } from 'node:buffer';
import process from 'node:process';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { buildWhereClause } from '../utils/sql';
import type { NewItemType, SelectItemsType, UpdateItemType } from '../schema/user';
import { users } from '../schema/user';

import { db } from '../utils/db';
import { BackendError, EnumErrorCode } from '../utils/errors';

export async function getItemById(id: number) {
  const [item] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return item;
}

export async function getItemByAccount(account: string) {
  const [item] = await db.select().from(users).where(eq(users.account, account)).limit(1);
  return item;
}

export async function addItem(user: NewItemType) {
  const { password, account } = user;

  if (typeof account != "string" || account.trim() == "") {
    throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
      message: 'invalid account value',
    });
  }

  const cUser = await getItemByAccount(account);

  if (cUser) {
    throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
      message: 'user already exists',
    });
  }

  const hashedPassword = await argon2.hash(password, {
    salt: Buffer.from(process.env.ARGON_2_SALT as string),
  });

  const [newItem] = await db
    .insert(users)
    .values({
      ...user,
      password: hashedPassword,
    });

  if (!newItem) {
    throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
      message: 'Failed to add user',
    });
  }

  return newItem;
}

/**
 * 邮件激活
 * ..param email
 */
export async function verifyUser(_email: string) {
  // const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  // if (!user) {
  //   throw new BackendError('USER_NOT_FOUND');
  // }
  return true;
}

export async function deleteItem(id: number) {
  const item = await getItemById(id);

  if (!item)
    throw new BackendError(EnumErrorCode.NOT_FOUND);

  const [deletedUser] = await db.delete(users).where(eq(users.id, id));
  return deletedUser;
}

export async function updateItem({ name, email, password, status, id, associateUsers, phone }: UpdateItemType) {
  const upItem: UpdateItemType = {
    id,
    name,
    email,
    status,
    associateUsers,
    phone
  };

  // 不能更新 account的值

  if (password) {
    const hashedPassword = await argon2.hash(password, {
      salt: Buffer.from(process.env.ARGON_2_SALT as string),
    });
    upItem.password = hashedPassword;
  }

  const [updatedItem] = await db
    .update(users)
    .set(upItem)
    .where(eq(users.id, id!));
  if (!updatedItem) {
    throw new BackendError(EnumErrorCode.NOT_FOUND, {
      message: 'User could not be updated',
    });
  }

  return updatedItem;
}

export async function getItems(query: SelectItemsType) {
  const { pageNum, pageSize, ...conditions } = query;
  const offset = (+pageNum! - 1) * +pageSize!;

  const whereCon = buildWhereClause(conditions, users);

  const items = await db.select()
    .from(users)
    .where(whereCon)
    .offset(offset)
    .limit(+pageSize!);
  return items;
}
