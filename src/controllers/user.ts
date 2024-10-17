import { Buffer } from 'node:buffer';
import process from 'node:process';
import argon2 from 'argon2';
import consola from 'consola';
import {
  type ItemType,
  SelectItemsType,
  deleteSchema,
  loginSchema,
  newSchema,
  updateSchema,
} from '@/schema/user';
import {
  addItem,
  deleteItem,
  getUserByAccount,
  getItems,
  updateItem,
} from '@/services/user';
import type { PagerParams } from '@/types/service';
import { createHandler } from '@/utils/create';
import { BackendError, EnumErrorCode } from '@/utils/errors';
import generateToken from '@/utils/jwt';

export const loginHandler = createHandler(loginSchema, async (req, res) => {
  const { account, password } = req.body;
  consola.log('body:', req.body);
  const user = await getUserByAccount(account);

  if (!user)
    throw new BackendError(EnumErrorCode.USER_NOT_FOUND);

  const matchPassword = await argon2.verify(user.password, password, {
    salt: Buffer.from(process.env.ARGON_2_SALT as string),
  });
  if (!matchPassword)
    throw new BackendError(EnumErrorCode.INVALID_PASSWORD);

  const token = generateToken(user.account);
  res.status(200).json({ code: 0, data: { token, account: user.account, name: user.name } });
});

export const addItemHandler = createHandler(newSchema, async (req, res) => {
  const user = req.body;

  const existingUser = await getUserByAccount(user.account);

  if (existingUser) {
    throw new BackendError(EnumErrorCode.CONFLICT, {
      message: 'User already exists',
    });
  }

  await addItem(user);

  res.status(201).json({
    code: 0
  });
});

export const deleteHandler = createHandler(deleteSchema, async (req, res) => {
  const { id } = req.body;

  const { user } = res.locals as { user: ItemType };

  if (user.account === 'admin') {
    throw new BackendError(EnumErrorCode.UNAUTHORIZED, {
      message: 'You are not authorized to delete this user',
    });
  }

  const deletedUser = await deleteItem(id);

  res.status(200).json({
    code: 0,
    data: deletedUser,
  });
});

export const getItemsHandler = createHandler(async (req, res) => {
  // @ts-ignore
  const pager = req.query as SelectItemsType;

  const data = await getItems(pager);

  res.status(200).json({
    code: 0,
    data
  });
});

export const updateHandler = createHandler(updateSchema, async (req, res) => {

  const user = req.body;

  const updatedUser = await updateItem(user);

  res.status(200).json({
    code: 0,
    data: updatedUser,
  });
});
