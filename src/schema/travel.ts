import { relations, type InferSelectModel } from 'drizzle-orm';
import { boolean, int, mysqlTable, text, timestamp, varchar, double } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { resources } from './resource';
import { pagerSchame, zNumberString } from './common';

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
    date: timestamp('date', { mode: "string" }).notNull(),
    createdAt: timestamp('created_at').$defaultFn(()=> new Date()),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export const schema = createSelectSchema(travels);
export const selectSchema = z.object({
    query:  schema.pick({
        province: true,
        city: true,
        county: true
    }).partial().merge(pagerSchame)
})

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
        })
        .partial()
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
        date: true
    }),
});


export const tralvelRelations = relations(travels, ({ one, many }) => ({
    resources: many(resources),
}));


export const statisticsSchama =  z.object({
    query: z.object({
        province: zNumberString,
        city: zNumberString,
        county: zNumberString
    }).partial(),
})


export type ItemType = InferSelectModel<typeof travels>;
export type NewItemType = z.infer<typeof newSchema>['body'];
export type UpdateItemType = z.infer<typeof updateSchema>['body'];
export type SelectItemsType = z.infer<typeof selectSchema>['query'];
export type StatisticsItemsType = z.infer<typeof statisticsSchama>['query'];
