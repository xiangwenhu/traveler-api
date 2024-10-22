import { PagerParamsType } from '@/schema/common';
import { regions } from '@/schema/region';
import { NewItemType, SelectItemsType, travels, UpdateItemType } from '@/schema/travel';
import { db } from '@/utils/db';
import { BackendError, EnumErrorCode } from '@/utils/errors';
import { buildWhereClause } from '@/utils/sql';
import { count, eq , aliasedTable} from 'drizzle-orm';


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
        .leftJoin(regionsC,  eq(regionsC.code, travels.city))
        .leftJoin(regionsCY, eq(regionsCY.code, travels.county))

    return {
        list: items,
        total: totalArr[0]?.count || 0
    }
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