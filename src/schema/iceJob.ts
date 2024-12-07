import type { InferSelectModel } from 'drizzle-orm';
import { int, mysqlTable, timestamp, varchar, json, MySqlJson } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { pagerSchema, zNumberString } from './common';

export const mediaJobs = mysqlTable('mediaJobs', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', {
    length: 255
  }),
  jobId: varchar('job_id', {
    length: 255
  }).notNull(),
  type: int().notNull(),
  status: int('status').notNull(),
  associationIds: json('association_ids').notNull(),
  ext: json(),
  message: varchar('message', { length: 255 }),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

const schema = createSelectSchema(mediaJobs);

export const selectSchema = z.object({
  query: z.object({
    type: zNumberString.or(z.number()),
    status: zNumberString.or(z.number()),
  }).merge(pagerSchema),
});

export const newSchema = z.object({
  body: schema.pick({
    jobId: true,
    type: true,
    status: true,
    associationIds: true
  }).merge(schema.pick({
    ext: true,
    message: true,
    name: true
  }).partial())
});

export const updateSchema = z.object({
  body: schema.pick({
    id: true
  }).merge(schema.pick({
    status: true,
    ext: true,
    message: true,
    name: true
  }).partial())
});


// 删除
export const deleteSchema = z.object({
  body: schema.pick({
    id: true,
  }),
});

export type ItemType = InferSelectModel<typeof mediaJobs>;
export type NewItemType = z.infer<typeof newSchema>['body'];
export type DeleteItemType = z.infer<typeof deleteSchema>['body'];
export type UpdateItemType = z.infer<typeof updateSchema>['body'];
export type SelectItemsType = z.infer<typeof selectSchema>["query"];
