import { eq } from 'drizzle-orm';
import type { NewItemType } from '../schema/travelTags';
import { travelTags } from '../schema/travelTags';

import { db } from '../utils/db';
import { BackendError, EnumErrorCode } from '../utils/errors';

export async function getItemsByTravelId(id: number) {
    const items = await db.select().from(travelTags).where(eq(travelTags.travelId, id));
    return items;
}

export async function addItem(item: NewItemType) {
    const [newItem] = await db
        .insert(travelTags)
        .values({
            ...item,
        });

    if (!newItem) {
        throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
            message: 'Failed to add  travel tag',
        });
    }

    return newItem;
}

export async function addItems(items: NewItemType[]) {
    items.forEach(item => {
        addItem(item)
    })
}


export async function deleteByTravelId(id: number) {
    const results = await db.delete(travelTags).where(eq(travelTags.travelId, id));
    return results;
}
