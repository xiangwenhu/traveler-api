import type { InferSelectModel } from 'drizzle-orm';
import { int, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
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

export const selectSchema = createSelectSchema(resources);

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

export const newSchema = z.object({
    body: selectSchema.pick({
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

export type ItemType = InferSelectModel<typeof resources>;
export type NewItemType = z.infer<typeof newSchema>['body'];
export type UpdataItemType = z.infer<typeof updateSchema>['body'];
