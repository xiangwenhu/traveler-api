import type { InferSelectModel } from 'drizzle-orm';
import { int, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { pagerSchame, zNumberString } from './common';

export const resources = mysqlTable('resources', {
    id: int('id').primaryKey().autoincrement(),
    travelId: int("travelId").notNull(),
    type: mysqlEnum('type', ["image", "audio", "video", 'text']).notNull(),
    url: varchar('url', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    duration: int('duration'),
    size: int('size').notNull(),
    width: int('width'),
    height: int('height'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
});

export const schema = createSelectSchema(resources);


export const selectSchema = z.object({
    query: z.object({
        travelId: zNumberString
    }).merge(pagerSchame)
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
    body: schema.pick({
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
export type SelectItemsType = z.infer<typeof selectSchema>["query"];
