import { type NewItemType, regions } from '@/schema/region';
import { eq, sql } from 'drizzle-orm';
import { db } from '../utils/db';
import { BackendError, EnumErrorCode } from '../utils/errors';

export async function addItem(item: NewItemType) {

  // TODO:: 检查code，如果存在，应该提示错误
  const [newItem] = await db
    .insert(regions)
    .values({
      ...item,
    });

  if (!newItem) {
    throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
      message: 'Failed to add region',
    });
  }
  return newItem.insertId;
}


export async function getItems(parentCode: number) {
  // const items = await db
  // .select()
  // .from(regions)
  // .where(eq(regions.parentCode, parentCode))    
  // return items;

  // 子查询：计算每个子节点下的子节点数量
  const subQuery = db
    .select({
      childParentCode: regions.parentCode,
      childrenNum: sql<number>`COUNT(*)`.as('childrenNum')
    })
    .from(regions)
    .groupBy(regions.parentCode)
    .as('subquery');

  // 主查询：获取子节点并加入子节点数量
  const result = await db
    .select({
      name: regions.name,
      code: regions.code,
      childrenNum: sql<number>`COALESCE((SELECT childrenNum FROM ${subQuery} WHERE ${subQuery.childParentCode} = ${regions.code}), 0)`
    })
    .from(regions)
    .where(eq(regions.parentCode, parentCode));

  return result;
}

