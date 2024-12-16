import { type InferSelectModel, relations } from 'drizzle-orm';
import { boolean, double, int, mysqlTable, text, timestamp, varchar, json, year , } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { pagerSchema1000, zNumberString } from './common';


// TODO::  开放时间，价格，游玩季节等

export const AAAAAScenics = mysqlTable('5AScenics', {
    id: int('id').primaryKey().autoincrement(),
    /**
     * 来源方的id
     */
    sourceId: int('source-id'),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    province: int('province').notNull(),
    city: int('city').notNull(),
    county: int('county'),
    address: varchar('address', { length: 255 }).notNull(),
    longitude: double().notNull(),
    latitude: double().notNull(),
    year: int('year'),
    createdAt: timestamp('created_at').$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
    photos: json().$defaultFn(() => []),
    tags: json().$defaultFn(() => []),
    // 官网
    website: json().$defaultFn(() => []),
    // 免费
    isfree: boolean("isfress").$defaultFn(()=> false),
    // 二维码
    QRCodes: json(),
});

export const schema = createSelectSchema(AAAAAScenics);
export const selectSchema = z.object({
    query: z.object({
        province: zNumberString,
        // city: zNumberString,
        // county: zNumberString,
        name: z.string()
    }).partial().merge(pagerSchema1000),
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
    body: schema.pick({
        id: true
    }).merge(schema.partial()),
});

export const newSchema = z.object({
    body: schema.pick({
        sourceId: true,
        name: true,
        description: true,
        province: true,
        city: true,
        county:true,
        address: true,
        longitude:true,
        latitude:true,
        year:true,
        createdAt: true,
        updatedAt: true,
        photos: true,
        tags: true,
        website: true,
        isfree: true,
        QRCodes: true
    })
});


export const statisticsSchama = z.object({
    query: z.object({
        province: zNumberString,
        city: zNumberString,
        county: zNumberString,
    }).partial(),
});

export type ItemType = InferSelectModel<typeof AAAAAScenics>;
export type NewItemType = z.infer<typeof newSchema>['body'];
export type UpdateItemType = z.infer<typeof updateSchema>['body'];
export type SelectItemsType = z.infer<typeof selectSchema>['query'];
export type StatisticsItemsType = z.infer<typeof statisticsSchama>['query'];
export type GetItemByIdType = z.infer<typeof getItemByIdSchema>['query'];
