import { Buffer } from 'node:buffer';
import process from 'node:process';
import argon2 from 'argon2';
import consola from 'consola';
import {
  type User,
  deleteUserSchema,
  loginSchema,
  newUserSchema,
  updateUserSchema,
} from '@/schema/user';
import {
  addUser,
  deleteUser,
  getUserByAccount,
  getUsers,
  updateUser,
} from '@/services/user-services';
import type { PagerParams } from '@/types/service';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';
import generateToken from '@/utils/jwt';

export const handleUserLogin = createHandler(loginSchema, async (req, res) => {
  const { account, password } = req.body;
  consola.log('body:', req.body);
  const user = await getUserByAccount(account);

  if (!user)
    throw new BackendError('USER_NOT_FOUND');

  const matchPassword = await argon2.verify(user.password, password, {
    salt: Buffer.from(process.env.ARGON_2_SALT as string),
  });
  if (!matchPassword)
    throw new BackendError('INVALID_PASSWORD');

  const token = generateToken(user.account);
  res.status(200).json({ token, account: user.account, name: user.name });
});

export const handleAddUser = createHandler(newUserSchema, async (req, res) => {
  const user = req.body;

  const existingUser = await getUserByAccount(user.account);

  if (existingUser) {
    throw new BackendError('CONFLICT', {
      message: 'User already exists',
    });
  }

  await addUser(user);

  res.status(201).json(user);
});

export const handleDeleteUser = createHandler(deleteUserSchema, async (req, res) => {
  const { id } = req.body;

  const { user } = res.locals as { user: User };

  if (user.account === 'admin') {
    throw new BackendError('UNAUTHORIZED', {
      message: 'You are not authorized to delete this user',
    });
  }

  const deletedUser = await deleteUser(id);

  res.status(200).json({
    user: deletedUser,
  });
});

export const handleGetUsers = createHandler(async (req, res) => {
  // @ts-ignore
  const pager = req.query as PagerParams;

  const users = await getUsers(pager);

  res.status(200).json(users);
});

export const handleUpdateUser = createHandler(updateUserSchema, async (req, res) => {
  const { user } = res.locals as { user: User };

  const { name, password, email } = req.body;

  const updatedUser = await updateUser(user, { name, password, email });

  res.status(200).json({
    user: updatedUser,
  });
});
