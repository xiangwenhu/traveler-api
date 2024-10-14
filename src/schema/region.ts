import type { InferSelectModel } from 'drizzle-orm';
import { boolean, int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const regions = mysqlTable('regions', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  code: int('code').notNull(),
  parentCode: int('parent_code').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export type Region = InferSelectModel<typeof regions>;

export const schema = createSelectSchema(regions);

export const SelectRegionSchema = z.object({
  body: schema.pick({
    parentCode: true,
  }),
});

export const newSchema = z.object({
  body: schema.pick({
    name: true,
    code: true,
    parentCode: true,
  }),
});

export type NewRegion = z.infer<typeof newSchema>['body'];
