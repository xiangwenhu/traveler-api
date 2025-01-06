import { type InferSelectModel, relations } from 'drizzle-orm';
import { boolean, double, int, mysqlTable, text, timestamp, varchar, json, smallint } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { number, z } from 'zod';
import { resources } from './resource';
import { pagerSchema, zNumberString } from './common';
import { title } from 'node:process';

export const travels = mysqlTable('travels', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  cover: varchar('cover', { length: 255 }).notNull(),
  province: int('province').notNull(),
  city: int('city').notNull(),
  county: int('county'),
  address: varchar('address', { length: 255 }).notNull(),
  longitude: double().notNull(),
  latitude: double().notNull(),
  date: timestamp('date', { mode: 'string' }).notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
  tags: json("tags").$defaultFn(() => []),
  scenicSpots: json("scenic_spots").$defaultFn(() => []),
  schools: json("schools").$defaultFn(() => []),
  user: varchar("user", { length: 20 }),
  works: json('works').$defaultFn(() => []),
  /** added at 2024-12-12 */
  endDate: timestamp('endDate', { mode: 'string' }).notNull(),
  cost: int('cost').notNull(),
  status: smallint("status").notNull().default(0),
  // 主要交通工具，用于自动演示用
  transport: smallint("transport"),
  // ice 云剪辑项目id
  iceProjectId: varchar('ice_project_id', { length: 100 })
});

export const schema = createSelectSchema(travels);
export const selectSchema = z.object({
  query: z.object({
    title: z.string(),
    province: zNumberString,
    city: zNumberString,
    county: zNumberString,
    date: z.string(),
    endDate: z.string(),
    status: z.string(),
  }).partial().merge(pagerSchema),
});

export const getItemByIdSchema = z.object({
  query: z.object({
    id: zNumberString,
  }),
});

// 删除
export const deleteSchema = z.object({
  body: schema.pick({
    id: true,
  }),
});

export const updateSchema = z.object({
  body: schema
    .pick({
      id: true,
      title: true,
      description: true,
      cover: true,
      province: true,
      city: true,
      county: true,
      address: true,
      latitude: true,
      longitude: true,
      date: true,
      scenicSpots: true,
      schools: true,
      works: true,
      endDate: true,
      cost: true,
      status: true,
      transport: true,
      iceProjectId: true
    }).partial().merge(z.object({
      tags: z.array(z.number())
    }))
    .partial(),
});

export const newSchema = z.object({
  body: schema.pick({
    title: true,
    description: true,
    cover: true,
    province: true,
    city: true,
    county: true,
    address: true,
    latitude: true,
    longitude: true,
    date: true,
    scenicSpots: true,
    endDate: true,
    cost: true,
    status: true,
    transport: true
  }).merge(z.object({
    tags: z.array(z.number())
  })),
});

export const tralvelRelations = relations(travels, ({ one, many }) => ({
  resources: many(resources),
}));

export const statisticsSchama = z.object({
  query: z.object({
    province: zNumberString,
    city: zNumberString,
    county: zNumberString,
  }).partial(),
});

export type ItemType = InferSelectModel<typeof travels>;
export type NewItemType = z.infer<typeof newSchema>['body'];
export type UpdateItemType = z.infer<typeof updateSchema>['body'];
export type SelectItemsType = z.infer<typeof selectSchema>['query'];
export type StatisticsItemsType = z.infer<typeof statisticsSchama>['query'];
export type GetItemByIdType = z.infer<typeof getItemByIdSchema>['query'];


// export const tagsRelations = relations(travelTags, ({ one }) => ({
//   tags: one(travels, {
//     fields: [travelTags.travelId],
//     references: [travels.id],
//   }),
// }));