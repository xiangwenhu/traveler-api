import { PagerParamsType } from '@/schema/common';
import { NewItemType, SelectItemsType, travels, UpdateItemType } from '@/schema/travel';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import { buildWhereClause } from '@/utils/sql';
import { count, eq } from 'drizzle-orm';

export async function getItems(options: SelectItemsType) {
    const { pageNum, pageSize } = options;
    const offset = (+pageNum - 1) * +pageSize;

    const whereCon = buildWhereClause(options, travels);

    const totalArr = await db.select({ count: count() }).from(travels).where(whereCon);

    const items =  await db
        .select()
        .from(travels)
        .offset(offset)
        .limit(+pageSize);

    return {
        data: items,
        total: totalArr[0]?.count || 0
    }
}

export async function updateItem(item: UpdateItemType) {
    const [updatedUser] = await db
        .update(travels)
        .set(item)
        .where(eq(travels.id, item.id!));
    if (!updatedUser) {
        throw new BackendError('NOT_FOUND', {
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
        throw new BackendError('INTERNAL_ERROR', {
            message: 'Failed to add travel',
        });
    }
    return newItem;
}


export async function deleteItem(id: number) {
    const [deletedItem] = await db.delete(travels).where(eq(travels.id, id));
    return deletedItem;
}