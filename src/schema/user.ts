import type { InferSelectModel } from 'drizzle-orm';
import { boolean, int, mysqlTable, timestamp, tinyint, varchar, json } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { pagerSchema } from './common';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  account: varchar('account', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  status: tinyint('status').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
  isAdmin: boolean('is_admin').notNull().default(false),
  associateUsers: json("associate_users").$defaultFn(() => null),
  phone: varchar('phone', { length: 20 }),
  readonly: boolean('is_readonly').default(false),
});

const schema = createSelectSchema(users, {
  email: schema =>
    schema.email.email().regex(/^([\w.%-]+@[a-z0-9.-]+\.[a-z]{2,6})*$/i),
});

export const selectSchema = z.object({
  query: schema.pick({
    account: true,
    name: true,
  }).merge(pagerSchema).partial(),
});

export const verifyUserSchema = z.object({
  query: schema.pick({
    id: true,
  }),
});

export const deleteSchema = z.object({
  body: schema.pick({
    id: true,
  }),
});

export const loginSchema = z.object({
  body: schema.pick({
    account: true,
    password: true,
  }),
});

export const updateSchema = z.object({
  body: schema
    .pick({
      id: true,
    }).merge(schema.pick({
      name: true,
      email: true,
      password: true,
      status: true,
      isAdmin: true,
      associateUsers: true,
      account: true,
      phone: true,
      readonly: true
    }).partial())
});

export const newSchema = z.object({
  body: schema.pick({
    account: true,
    name: true,
    email: true,
    password: true,
    status: true,
    isAdmin: true,
    readonly: true
  }).merge(schema.pick({
    associateUsers: true,
    phone: true,
  }).partial())
});

export type ItemType = InferSelectModel<typeof users>;
export type NewItemType = z.infer<typeof newSchema>['body'];
export type UpdateItemType = z.infer<typeof updateSchema>['body'];
export type SelectItemsType = z.infer<typeof selectSchema>['query'];
