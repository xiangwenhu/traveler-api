import { type NewItemType, regions } from '@/schema/region';
import { eq } from 'drizzle-orm';
import { db } from '../utils/db';
import { BackendError } from '../utils/errors';

export async function addItem(item: NewItemType) {
  const [newItem] = await db
    .insert(regions)
    .values({
      ...item,
    });

  if (!newItem) {
    throw new BackendError('INTERNAL_ERROR', {
      message: 'Failed to add region',
    });
  }
  return newItem.insertId;
}


export async function getItems(parentCode: number) { 
    const items = await db.select().from(regions).where(eq(regions.parentCode, parentCode))
    return items;
  }
  