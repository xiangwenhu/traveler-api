import { PagerParamsType } from '@/schema/common';
import { regions } from '@/schema/region';
import { NewItemType, SelectItemsType, StatisticsItemsType, travels, UpdateItemType } from '@/schema/travel';
import { db } from '@/utils/db';
import { BackendError, EnumErrorCode } from '@/utils/errors';
import { buildGroupByClause, buildWhereClause, customCount } from '@/utils/sql';
import { count, eq, aliasedTable } from 'drizzle-orm';


export async function getItems(options: SelectItemsType) {
    const { pageNum, pageSize } = options;
    const offset = (+pageNum - 1) * +pageSize;

    const whereCon = buildWhereClause(options, travels);

    const totalArr = await db.select({ count: count() }).from(travels).where(whereCon);


    const regionsC = aliasedTable(regions, "regionsC");
    const regionsCY = aliasedTable(regions, "regionsCY");


    const items = await db
        .select({
            id: travels.id,
            title: travels.title,
            description: travels.description,
            cover: travels.cover,
            date: travels.date,
            latitude: travels.latitude,
            longitude: travels.longitude,
            province: regions.code,
            city: regionsC.code,
            county: regionsCY.code,
            provinceName: regions.name,
            cityName: regionsC.name,
            countyName: regionsCY.name,
            address: travels.address,
            createdAt: travels.createdAt,
            updatedAt: travels.updatedAt,
        })
        .from(travels)
        .offset(offset)
        .limit(+pageSize)
        .leftJoin(regions, eq(regions.code, travels.province))
        .leftJoin(regionsC, eq(regionsC.code, travels.city))
        .leftJoin(regionsCY, eq(regionsCY.code, travels.county))

    return {
        list: items,
        total: totalArr[0]?.count || 0
    }
}

export async function getItemById(id: number) {
    const [item] = await db.select().from(travels).where(eq(travels.id, id)).limit(1);
    return item;
}

export async function updateItem(item: UpdateItemType) {
    const [updatedUser] = await db
        .update(travels)
        .set(item)
        .where(eq(travels.id, item.id!));
    if (!updatedUser) {
        throw new BackendError(EnumErrorCode.NOT_FOUND, {
            message: 'Travel could not be updated',
        });
    }

    return updatedUser;
}

export async function addItem(item: NewItemType) {
    const [newItem] = await db
        .insert(travels)
        .values(item)

    if (!newItem) {
        throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
            message: 'Failed to add travel',
        });
    }
    return newItem;
}

export async function deleteItem(id: number) {
    const [deletedItem] = await db.delete(travels).where(eq(travels.id, id));
    return deletedItem;
}



function getStatisticsColInfo(options: StatisticsItemsType) {
    if (!options.province) return {
        count: travels.province,
        groupBy: travels.province,
        leftJoin: travels.province,
    }
    if (!options.city) return {
        count: travels.city,
        groupBy: travels.city,
        leftJoin: travels.city
    }
    if (!options.county) return {
        count: travels.county,
        groupBy: travels.county,
        leftJoin: travels.county
    }
    return {
        count: undefined,
        groupBy: travels.county,
        leftJoin: travels.county
    }
}


export async function statisticsItems(options: StatisticsItemsType) {

    const whereClause = buildWhereClause(options, travels);
    const colInfo = getStatisticsColInfo(options);

    // 先分组计算
    const sq = db.select({
        code: colInfo.groupBy,
        count: customCount(colInfo.count)
    })
        .from(travels)
        .where(whereClause)
        .groupBy(colInfo.groupBy)
        .as("tt");


    // 获取区域name
    const result = await db.select({
        code: sq.code,
        count: sq.count,
        name: regions.name
    })
        .from(sq).leftJoin(regions, eq(sq.code, regions.code));

    return result;
}
