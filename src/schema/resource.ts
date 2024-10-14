import type { InferSelectModel } from 'drizzle-orm';
import { boolean, int, mysqlTable, text, timestamp, varchar, mysqlEnum } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const resources = mysqlTable('resources', {
    id: int('id').primaryKey().autoincrement(),
    travelId:int("travelId").notNull(),
    type: mysqlEnum(["image", "audio", "video"]).notNull(),
    url: varchar('name', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    duration: int('duration'),
    size: int('duration').notNull(),
    width: int('width'),
    height: int('height'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export const selectResourceSchema = createSelectSchema(resources);

// 删除
export const deleteResourceSchema = z.object({
    body: selectResourceSchema.pick({
        id: true,
    }),
});

export const updateResourceSchema = z.object({
    body: selectResourceSchema
        .pick({
            id: true,
            travelId: true,
            title: true,
            duration: true,
            size: true,
            width: true,
            height: true,
            type: true
        })
        .partial(),
});

export const newResourceSchema = z.object({
    body: selectResourceSchema.pick({
        travelId: true,
        type: true,
        url: true,
        title: true,
        duration: true,
        size: true,
        width: true,
        height: true,
    }),
});

export type Resource = InferSelectModel<typeof resources>;
export type NewResource = z.infer<typeof newResourceSchema>['body'];
export type UpdateResource = z.infer<typeof updateResourceSchema>['body'];
