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

export const selectTravelSchema = createSelectSchema(travels);

// 删除
export const deleteTravelSchema = z.object({
    body: selectTravelSchema.pick({
        id: true,
    }),
});

export const updateTravelSchema = z.object({
    body: selectTravelSchema
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

export const newTravelSchema = z.object({
    body: selectTravelSchema.pick({
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

export const addTravelResourceSchema = z.object({
    body: selectTravelSchema
        .merge(z.object({
            resources: z.array(z.number())
        }))
        .pick({
            id: true,
            resources: true
        })
        .partial()
});


export const tralvelRelations = relations(travels, ({ one, many }) => ({
    resources: many(resources),
}));


export type Travel = InferSelectModel<typeof travels>;
export type NewTravel = z.infer<typeof newTravelSchema>['body'];
export type UpdateTravel = z.infer<typeof updateTravelSchema>['body'];
