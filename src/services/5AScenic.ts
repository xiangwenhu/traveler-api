import { aliasedTable, count, eq } from 'drizzle-orm';
import { regions } from '../schema/region';
import { AAAAAScenics, type NewItemType, type SelectItemsType, type StatisticsItemsType, type UpdateItemType } from  "../schema/5AScenic"
import { db } from '../utils/db';
import { BackendError, EnumErrorCode } from '../utils/errors';
import { buildWhereClause, customCount } from '../utils/sql';
import { getItems as getRegionItems } from './region';

export async function getItems(options: SelectItemsType) {
  const { pageNum, pageSize } = options;
  const offset = (+pageNum - 1) * +pageSize;

  const whereCon = buildWhereClause(options, AAAAAScenics);

  const totalArr = await db.select({ count: count() }).from(AAAAAScenics).where(whereCon);

  const regionsC = aliasedTable(regions, 'regionsC');
  const regionsCY = aliasedTable(regions, 'regionsCY');


  const items = await db
    .select({
      id: AAAAAScenics.id,
      name: AAAAAScenics.name,
      description: AAAAAScenics.description,
      year: AAAAAScenics.year,
      latitude: AAAAAScenics.latitude,
      longitude: AAAAAScenics.longitude,
      province: regions.code,
      city: regionsC.code,
      county: regionsCY.code,
      provinceName: regions.name,
      cityName: regionsC.name,
      countyName: regionsCY.name,
      address: AAAAAScenics.address,
      createdAt: AAAAAScenics.createdAt,
      updatedAt: AAAAAScenics.updatedAt,
      tags: AAAAAScenics.tags,
      photos: AAAAAScenics.photos,
      website: AAAAAScenics.website,
      isfree: AAAAAScenics.isfree
    })
    .from(AAAAAScenics)
    .where(whereCon)
    .offset(offset)
    .limit(+pageSize)
    .leftJoin(regions, eq(regions.code, AAAAAScenics.province))
    .leftJoin(regionsC, eq(regionsC.code, AAAAAScenics.city))
    .leftJoin(regionsCY, eq(regionsCY.code, AAAAAScenics.county))


  return {
    list: items,
    total: totalArr[0]?.count || 0,
  };
}

export async function getItemById(id: number) {
  const [item] = await db.select().from(AAAAAScenics).where(eq(AAAAAScenics.id, id)).limit(1);
  return item;
}

export async function updateItem(item: UpdateItemType) {
  const [updatedUser] = await db
    .update(AAAAAScenics)
    .set(item)
    .where(eq(AAAAAScenics.id, item.id!));
  if (!updatedUser) {
    throw new BackendError(EnumErrorCode.NOT_FOUND, {
      message: 'Travel could not be updated',
    });
  }

  return updatedUser;
}

export async function addItem(item: NewItemType) {
  const [newItem] = await db
    .insert(AAAAAScenics)
    .values(item);

  if (!newItem) {
    throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
      message: 'Failed to add travel',
    });
  }
  return newItem;
}

export async function deleteItem(id: number) {
  const [deletedItem] = await db.delete(AAAAAScenics).where(eq(AAAAAScenics.id, id));
  return deletedItem;
}

async function getStatisticsColInfo(options: StatisticsItemsType) {
  if (!options.province) {
    return {
      count: AAAAAScenics.province,
      groupBy: AAAAAScenics.province,
      leftJoin: AAAAAScenics.province,
    };
  }

  // 比如台湾省， 只到省
  const cityChilren = await getRegionItems(+options.province);
  if (cityChilren.length == 0) {
    return {
      count: AAAAAScenics.province,
      groupBy: AAAAAScenics.province,
      leftJoin: AAAAAScenics.province,
    };
  }

  if (!options.city) {
    return {
      count: AAAAAScenics.city,
      groupBy: AAAAAScenics.city,
      leftJoin: AAAAAScenics.city,
    };
  }

  // 比如北京，天津，直到 二级， 北京/东城
  const countyChilren = await getRegionItems(+options.city);
  if (countyChilren.length == 0) {
    return {
      count: AAAAAScenics.city,
      groupBy: AAAAAScenics.city,
      leftJoin: AAAAAScenics.city,
    };
  }

  if (!options.county) {
    return {
      count: AAAAAScenics.county,
      groupBy: AAAAAScenics.county,
      leftJoin: AAAAAScenics.county,
    };
  }
  return {
    count: undefined,
    groupBy: AAAAAScenics.county,
    leftJoin: AAAAAScenics.county,
  };
}

export async function statisticsItems(options: StatisticsItemsType) {
  const whereClause = buildWhereClause(options, AAAAAScenics);
  const colInfo = await getStatisticsColInfo(options);

  // 先分组计算
  const sq = db.select({
    code: colInfo.groupBy,
    count: customCount(colInfo.count),
  })
    .from(AAAAAScenics)
    .where(whereClause)
    .groupBy(colInfo.groupBy)
    .as('tt');

  // 获取区域name
  const query = db.select({
    code: sq.code,
    count: sq.count,
    name: regions.name,
  })
    .from(sq).leftJoin(regions, eq(sq.code, regions.code));

  console.log('query:', query.toSQL());
  const result = await query;
  return result;
}
