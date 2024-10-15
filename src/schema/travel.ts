import { relations, type InferSelectModel } from 'drizzle-orm';
import { boolean, int, mysqlTable, text, timestamp, varchar, double } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { resources } from './resource';

export const travels = mysqlTable('travels', {
    id: int('id').primaryKey().autoincrement(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    cover: varchar('cover', { length: 255 }).notNull(),
    province: int('province').notNull(),
    city: int('city').notNull(),
    county: int('county').notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    longitude: double().notNull(),
    latitude: double().notNull(),
    date: timestamp('date').notNull(),
    createddAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export const selectSchema = createSelectSchema(travels);

// 删除
export const deleteSchema = z.object({
    body: selectSchema.pick({
        id: true,
    }),
});

export const updateSchema = z.object({
    body: selectSchema
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
    body: selectSchema.pick({
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


export type ItemType = InferSelectModel<typeof travels>;
export type NewItemType = z.infer<typeof newSchema>['body'];
export type UpdateItemType = z.infer<typeof updateSchema>['body'];
