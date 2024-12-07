import { count, eq } from 'drizzle-orm';
import type { NewItemType, SelectItemsType, UpdateItemType } from '../schema/iceJob';
import { mediaJobs } from '../schema/iceJob';
import { buildWhereClause } from '../utils/sql';

import { db } from '../utils/db';
import { BackendError, EnumErrorCode } from '../utils/errors';

export async function getItemById(id: number) {
    const [item] = await db.select().from(mediaJobs).where(eq(mediaJobs.id, id)).limit(1);
    return item;
}


export async function getItemByJobId(jobId: string) {
    const [item] = await db.select().from(mediaJobs).where(eq(mediaJobs.jobId, jobId)).limit(1);
    return item;
}

export async function addItem(item: NewItemType) {
    const [newItem] = await db
        .insert(mediaJobs)
        .values({
            ...item,
        });

    if (!newItem) {
        throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
            message: 'Failed to add ICE job',
        });
    }

    return newItem;
}


export async function deleteItem(id: number) {
    const item = await getItemById(id);

    if (!item)
        throw new BackendError(EnumErrorCode.NOT_FOUND);

    const [deletedItem] = await db.delete(mediaJobs).where(eq(mediaJobs.id, id));
    return deletedItem;
}

export async function updateItem(item: UpdateItemType) {
    const [updatedItem] = await db
        .update(mediaJobs)
        .set(item)
        .where(eq(mediaJobs.id, item.id!));
    if (!updatedItem) {
        throw new BackendError(EnumErrorCode.NOT_FOUND, {
            message: 'ICE job could not be updated',
        });
    }

    return updatedItem;
}

export async function getItems(query: SelectItemsType) {
    const { pageNum, pageSize, ...conditions } = query;
    const offset = (+pageNum! - 1) * +pageSize!;

    const totalArr = await db.select({ count: count() }).from(mediaJobs);

    const whereCon = buildWhereClause(conditions, mediaJobs);

    const items = await db.select()
        .from(mediaJobs)
        .where(whereCon)
        .offset(offset)
        .limit(+pageSize!);
    return {
        list: items,
        total: totalArr[0]?.count || 0,
    };
}
