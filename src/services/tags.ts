import { count, eq } from 'drizzle-orm';
import type { NewItemType, SelectItemsType, UpdateItemType } from '../schema/tags';
import { tags } from '../schema/tags';
import { buildWhereClause } from '../utils/sql';

import { db } from '../utils/db';
import { BackendError, EnumErrorCode } from '../utils/errors';

export async function getItemById(id: number) {
    const [item] = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
    return item;
}

export async function addItem(item: NewItemType) {
    const [newItem] = await db
        .insert(tags)
        .values({
            ...item,
        });

    if (!newItem) {
        throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
            message: 'Failed to add tag',
        });
    }

    return newItem;
}


export async function deleteItem(id: number) {
    const item = await getItemById(id);

    if (!item)
        throw new BackendError(EnumErrorCode.NOT_FOUND);

    const [deletedItem] = await db.delete(tags).where(eq(tags.id, id));
    return deletedItem;
}

export async function updateItem(item: UpdateItemType) {
    const [updatedItem] = await db
        .update(tags)
        .set(item)
        .where(eq(tags.id, item.id!));
    if (!updatedItem) {
        throw new BackendError(EnumErrorCode.NOT_FOUND, {
            message: 'Tag could not be updated',
        });
    }

    return updatedItem;
}

export async function getItems(query: SelectItemsType) {
    const { pageNum, pageSize, ...conditions } = query;
    const offset = (+pageNum! - 1) * +pageSize!;

    const totalArr = await db.select({ count: count() }).from(tags);

    const whereCon = buildWhereClause(conditions, tags);

    const items = await db.select()
        .from(tags)
        .where(whereCon)
        .offset(offset)
        .limit(+pageSize!);
    return {
        list: items,
        total: totalArr[0]?.count || 0,
    };
}
