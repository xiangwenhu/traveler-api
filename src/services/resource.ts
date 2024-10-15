import { PagerParamsType } from '@/schema/common';
import { NewItemType, resources, UpdataItemType } from '@/schema/resource';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import { eq } from 'drizzle-orm';


export async function getByTraverlId(options: {
    travelId: number
} & PagerParamsType) {
    const { travelId, pageNum, pageSize } = options;
    const offset = (pageNum - 1) * pageSize;

    return await db
        .select()
        .from(resources)
        .where(eq(resources.travelId, travelId))
        .offset(offset)
        .limit(pageSize);
}

export async function updateItem(item: UpdataItemType) {
    const [updatedUser] = await db
        .update(resources)
        .set(item)
        .where(eq(resources.id, item.id!));
    if (!updatedUser) {
        throw new BackendError('NOT_FOUND', {
            message: 'Resource could not be updated',
        });
    }

    return updatedUser;
}


export async function addItem(item: NewItemType) {
    const [newItem] = await db
        .insert(resources)
        .values(item)

    if (!newItem) {
        throw new BackendError('INTERNAL_ERROR', {
            message: 'Failed to add resource',
        });
    }
    return newItem;
}


export async function deleteItem(id: number) {
    const [deletedItem] = await db.delete(resources).where(eq(resources.id, id));
    return deletedItem;
}

export async function getItems(options: PagerParamsType) {
    const { pageNum, pageSize } = options;
    const offset = (pageNum - 1) * pageSize;

    return await db
        .select()
        .from(resources)
        .offset(offset)
        .limit(pageSize);
}