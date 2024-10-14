import type { InferSelectModel } from 'drizzle-orm';
import { boolean, int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  account: varchar('account', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  status: boolean('status').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
  isAdmin: boolean('is_admin').notNull().default(false),
});

export const selectUserSchema = createSelectSchema(users, {
  email: schema =>
    schema.email.email().regex(/^([\w.%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/i),
});

export const verifyUserSchema = z.object({
  query: selectUserSchema.pick({
    id: true,
  }),
});

export const deleteUserSchema = z.object({
  body: selectUserSchema.pick({
    id: true,
  }),
});

export const loginSchema = z.object({
  body: selectUserSchema.pick({
    account: true,
    password: true,
  }),
});

export const updateUserSchema = z.object({
  body: selectUserSchema
    .pick({
      id: true,
      name: true,
      email: true,
      password: true,
      status: true,
      isAdmin: true,
    })
    .partial(),
});

export const newUserSchema = z.object({
  body: selectUserSchema.pick({
    account: true,
    name: true,
    email: true,
    password: true,
    status: true,
    isAdmin: true,
  }),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = z.infer<typeof newUserSchema>['body'];
export type UpdateUser = z.infer<typeof updateUserSchema>['body'];
