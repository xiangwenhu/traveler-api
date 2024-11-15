import type { InferSelectModel } from 'drizzle-orm';
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { pagerSchema, zNumberString } from './common';

export const tags = mysqlTable('tags', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  parentId: int('parent_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

const schema = createSelectSchema(tags);

export const selectSchema = z.object({
  query: z.object({
    parentId:  zNumberString
  }).merge(pagerSchema),
});

export const newSchema = z.object({
  body: schema.pick({
    name: true,
    parentId: true,
  }),
});

export const updateSchema = z.object({
    body: schema
        .pick({
            id: true,
            name: true
        })
        .partial(),
});


// 删除
export const deleteSchema = z.object({
    body: schema.pick({
        id: true,
    }),
});

export type ItemType = InferSelectModel<typeof tags>;
export type NewItemType = z.infer<typeof newSchema>['body'];
export type DeleteItemType = z.infer<typeof deleteSchema>['body'];
export type UpdateItemType = z.infer<typeof updateSchema>['body'];
export type SelectItemsType = z.infer<typeof selectSchema>["query"];
