import { int, uniqueIndex, mysqlTable } from 'drizzle-orm/mysql-core';
import { travels } from './travel';
import { tags } from './tags';
import { InferSelectModel } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { pagerSchema, zNumberString } from './common';

export const travelTags = mysqlTable(
    'travel_tags',
    {
        travelId: int('travel_id').notNull().references(() => travels.id),
        tagId: int('tag_id').notNull().references(() => tags.id),
    },
    (table) => ({
        // 创建联合主键，保证每一对 (travelId, tagId) 是唯一的
        pk: uniqueIndex('travel_tag_pk').on(table.travelId, table.tagId),
    }),
);

const schema = createSelectSchema(travelTags);

export const selectSchema = z.object({
  query: z.object({
    parentId:  zNumberString
  }).merge(pagerSchema),
});

export const newSchema = z.object({
  body: schema.pick({
    tagId: true,
    travelId: true,
  }),
});

export const updateSchema = z.object({
    body: schema
        .pick({
            tagId: true,
            travelId: true
        })
});


// 删除
export const deleteSchema = z.object({
    body: schema.pick({
        tagId: true,
        travelId: true
    }),
});

export type ItemType = InferSelectModel<typeof travelTags>;
export type NewItemType = z.infer<typeof newSchema>['body'];
export type DeleteItemType = z.infer<typeof deleteSchema>['body'];
export type UpdateItemType = z.infer<typeof updateSchema>['body'];
export type SelectItemsType = z.infer<typeof selectSchema>["query"];
