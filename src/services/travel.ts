import { aliasedTable, count, eq, sql, and, inArray, between, like } from 'drizzle-orm';
import { regions } from '../schema/region';
import type { NewItemType, SelectItemsType, StatisticsItemsType, UpdateItemType } from '../schema/travel';
import { travels } from '../schema/travel';
import { db } from '../utils/db';
import { BackendError, EnumErrorCode } from '../utils/errors';
import { buildWhereClause, customCount } from '../utils/sql';
import { getItems as getRegionItems } from './region';
import _ from 'lodash';
import consola from 'consola';
import { timestamp } from 'drizzle-orm/mysql-core';

export async function getItems(options: SelectItemsType, accounts: string[]) {
  const { pageNum, pageSize } = options;
  const offset = (+pageNum - 1) * +pageSize;


  const { status,  date, endDate, title, ...opts } = options;

  let whereCon = buildWhereClause(opts, travels, [travels.title.name]);

  const strTitle = options.title ?  `${options.title}`.trim(): undefined;

  if(strTitle){
    whereCon = and(whereCon, like(travels.title, `%${strTitle}%`));
  }

  if(date && endDate){
    whereCon = and(whereCon, between(travels.date, new Date(date).toISOString(), new Date(endDate).toISOString()));
  }

  // 用户
  whereCon = and(whereCon, inArray(travels.user, accounts));

  // 状态
  if (status != undefined) {
    const sArr = status.split(",").map(v => + v);
    whereCon = and(whereCon, inArray(travels.status, sArr))
  }

  consola.log("whereCon",whereCon);

  const totalArr = await db.select({ count: count() }).from(travels).where(whereCon);

  const regionsC = aliasedTable(regions, 'regionsC');
  const regionsCY = aliasedTable(regions, 'regionsCY');


  const items = await db
    .select({
      id: travels.id,
      title: travels.title,
      description: travels.description,
      cover: travels.cover,
      date: travels.date,
      latitude: travels.latitude,
      longitude: travels.longitude,
      province: regions.code,
      city: regionsC.code,
      county: regionsCY.code,
      provinceName: regions.name,
      cityName: regionsC.name,
      countyName: regionsCY.name,
      address: travels.address,
      createdAt: travels.createdAt,
      updatedAt: travels.updatedAt,
      tags: travels.tags,
      scenicSpots: travels.scenicSpots,
      schools: travels.schools,
      cost: travels.cost,
      endDate: travels.endDate,
      status: travels.status,
      transport: travels.transport,
      iceProjectId: travels.iceProjectId,
    })
    .from(travels)
    .where(whereCon)
    .offset(offset)
    .limit(+pageSize)
    .leftJoin(regions, eq(regions.code, travels.province))
    .leftJoin(regionsC, eq(regionsC.code, travels.city))
    .leftJoin(regionsCY, eq(regionsCY.code, travels.county))
    .orderBy(sql`${travels.date} desc`)


  return {
    list: items,
    total: totalArr[0]?.count || 0,
  };
}

export async function getItemById(id: number) {
  const [item] = await db.select().from(travels).where(eq(travels.id, id)).limit(1);
  return item;
}

export async function updateItem(item: UpdateItemType) {
  const [updatedUser] = await db
    .update(travels)
    .set(item)
    .where(eq(travels.id, item.id!));
  if (!updatedUser) {
    throw new BackendError(EnumErrorCode.NOT_FOUND, {
      message: 'Travel could not be updated',
    });
  }

  return updatedUser;
}

export async function addItem(item: NewItemType) {
  const [newItem] = await db
    .insert(travels)
    .values(item);

  if (!newItem) {
    throw new BackendError(EnumErrorCode.INTERNAL_ERROR, {
      message: 'Failed to add travel',
    });
  }
  return newItem;
}

export async function deleteItem(id: number) {
  const [deletedItem] = await db.delete(travels).where(eq(travels.id, id));
  return deletedItem;
}

async function getStatisticsColInfo(options: StatisticsItemsType) {
  if (!options.province) {
    return {
      count: travels.province,
      groupBy: travels.province,
      leftJoin: travels.province,
    };
  }

  // 比如台湾省， 只到省
  const cityChildren = await getRegionItems(+options.province);
  if (cityChildren.length == 0) {
    return {
      count: travels.province,
      groupBy: travels.province,
      leftJoin: travels.province,
    };
  }

  if (!options.city) {
    return {
      count: travels.city,
      groupBy: travels.city,
      leftJoin: travels.city,
    };
  }

  // 比如北京，天津，直到 二级， 北京/东城
  const countyChildren = await getRegionItems(+options.city);
  if (countyChildren.length == 0) {
    return {
      count: travels.city,
      groupBy: travels.city,
      leftJoin: travels.city,
    };
  }

  if (!options.county) {
    return {
      count: travels.county,
      groupBy: travels.county,
      leftJoin: travels.county,
    };
  }
  return {
    count: undefined,
    groupBy: travels.county,
    leftJoin: travels.county,
  };
}

export async function statisticsItems(options: StatisticsItemsType) {
  const whereClause = buildWhereClause(options, travels);
  const colInfo = await getStatisticsColInfo(options);

  // 先分组计算
  const sq = db.select({
    code: colInfo.groupBy,
    count: customCount(colInfo.count),
  })
    .from(travels)
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
