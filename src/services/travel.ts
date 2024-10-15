import { PagerParamsType } from '@/schema/common';
import { NewItemType, travels, UpdateItemType } from '@/schema/travel';
import { db } from '@/utils/db';
import { BackendError } from '@/utils/errors';
import { eq } from 'drizzle-orm';


export async function getItems(options: PagerParamsType) {
    const { pageNum, pageSize } = options;
    const offset = (pageNum - 1) * pageSize;

    return await db
        .select()
        .from(travels)
        .offset(offset)
        .limit(pageSize);
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