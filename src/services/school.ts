import { aliasedTable, and, count, eq, like } from 'drizzle-orm';
import { regions } from '../schema/region';
import { schools, type NewItemType, type SelectItemsType, type StatisticsItemsType, type UpdateItemType } from  "../schema/school"
import { db } from '../utils/db';
import { BackendError, EnumErrorCode } from '../utils/errors';
import { buildWhereClause, customCount } from '../utils/sql';
import { getItems as getRegionItems } from './region';

export async function getItems(options: SelectItemsType) {
  const { pageNum, pageSize } = options;
  const offset = (+pageNum - 1) * +pageSize;

  let whereCon = buildWhereClause(options, schools, [schools.name.name]);
  const name = options.name ?  `${options.name}`.trim(): undefined;
  if(name){
    whereCon = and(whereCon, like(schools.name, `%${name}%`))
  }
  const totalArr = await db.select({ count: count() }).from(schools).where(whereCon);

  const regionsC = aliasedTable(regions, 'regionsC');
  const regionsCY = aliasedTable(regions, 'regionsCY');


  const items = await db
    .select({
      id: schools.id,
      name: schools.name,
      description: schools.description,
      latitude: schools.latitude,
      longitude: schools.longitude,
      province: regions.code,
      city: regionsC.code,
      county: regionsCY.code,
      provinceName: regions.name,
      cityName: regionsC.name,
      countyName: regionsCY.name,
      address: schools.address,
      createdAt: schools.createdAt,
      updatedAt: schools.updatedAt,
      tags: schools.tags,
      photos: schools.photos,
      website: schools.website,
      type: schools.type,
      rank: schools.rank,
      is985: schools.is985,
      is211: schools.is211
    })
    .from(schools)
    .where(whereCon)
    .offset(offset)
    .limit(+pageSize)
    .leftJoin(regions, eq(regions.code, schools.province))
    .leftJoin(regionsC, eq(regionsC.code, schools.city))
    .leftJoin(regionsCY, eq(regionsCY.code, schools.county))


  return {
    list: items,
    total: totalArr[0]?.count || 0,
  };
}

export async function getItemById(id: number) {
  const [item] = await db.select().from(schools).where(eq(schools.id, id)).limit(1);
  return item;
}

export async function updateItem(item: UpdateItemType) {
  const [updatedUser] = await db
    .update(schools)
    .set(item)
    .where(eq(schools.id, item.id!));
  if (!updatedUser) {
    throw new BackendError(EnumErrorCode.NOT_FOUND, {
      message: 'school could not be updated',
    });
  }

  return updatedUser;
}

export async function addItem(item: NewItemType) {
  const [newItem] = await db
    .insert(schools)
    .values(item);

  if (!newItem) {
    throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
      message: 'Failed to add school',
    });
  }
  return newItem;
}

export async function deleteItem(id: number) {
  const [deletedItem] = await db.delete(schools).where(eq(schools.id, id));
  return deletedItem;
}

async function getStatisticsColInfo(options: StatisticsItemsType) {
  if (!options.province) {
    return {
      count: schools.province,
      groupBy: schools.province,
      leftJoin: schools.province,
    };
  }

  // 比如台湾省， 只到省
  const cityChilren = await getRegionItems(+options.province);
  if (cityChilren.length == 0) {
    return {
      count: schools.province,
      groupBy: schools.province,
      leftJoin: schools.province,
    };
  }

  if (!options.city) {
    return {
      count: schools.city,
      groupBy: schools.city,
      leftJoin: schools.city,
    };
  }

  // 比如北京，天津，直到 二级， 北京/东城
  const countyChilren = await getRegionItems(+options.city);
  if (countyChilren.length == 0) {
    return {
      count: schools.city,
      groupBy: schools.city,
      leftJoin: schools.city,
    };
  }

  if (!options.county) {
    return {
      count: schools.county,
      groupBy: schools.county,
      leftJoin: schools.county,
    };
  }
  return {
    count: undefined,
    groupBy: schools.county,
    leftJoin: schools.county,
  };
}

export async function statisticsItems(options: StatisticsItemsType) {
  const whereClause = buildWhereClause(options, schools);
  const colInfo = await getStatisticsColInfo(options);

  // 先分组计算
  const sq = db.select({
    code: colInfo.groupBy,
    count: customCount(colInfo.count),
  })
    .from(schools)
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
