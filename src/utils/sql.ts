import type { AnyColumn, SQL } from 'drizzle-orm';
import { and, eq, sql } from 'drizzle-orm';
import type { MySqlColumn, MySqlTableWithColumns } from 'drizzle-orm/mysql-core';

const WHITE_LIST = ['pageSize', 'pageNum'];

export function buildWhereClause(filters: Record<string, any>, tableSchema: MySqlTableWithColumns<any>, whiteList: string[] = []) {
  const wList = WHITE_LIST.concat(whiteList);

  // 将过滤器对象转换为数组并过滤掉 null 或 undefined 值
  const whereConditions: SQL[] = Object.entries(filters).map(([key, value]) => {
    if (wList.includes(key)) {
      return undefined;
    }

    // 检查表模式中是否包含当前键
    const column = tableSchema[key];
    if (column) {
      // 使用 eq 创建等值条件
      return eq(column, value);
    }
    // 如果列不存在，则返回 null
    return undefined;
  }).filter(Boolean) as SQL[]; // 过滤掉任何可能的 null 值

  // 如果没有有效的条件，则返回 undefined
  if (whereConditions.length === 0) {
    return undefined;
  }

  // 使用 and 函数组合所有的条件
  return and(...whereConditions);
}

export function buildGroupByClause(filters: Record<string, any>, tableSchema: MySqlTableWithColumns<any>, whiteList: string[] = []) {
  const wList = WHITE_LIST.concat(whiteList);

  const conditions: MySqlColumn[] = Object.entries(filters).map(([key, value]) => {
    if (wList.includes(key)) {
      return undefined;
    }

    // 检查表模式中是否包含当前键
    const column = tableSchema[key];
    if (column) {
      return column;
    }
    // 如果列不存在
    return undefined;
  }).filter(Boolean) as MySqlColumn[]; // 过滤掉任何可能的 null 值

  // 如果没有有效的条件，则返回 undefined
  if (conditions.length === 0) {
    return [];
  }

  // 使用 and 函数组合所有的条件
  return conditions;
}

export function customCount(column?: AnyColumn, alias = 'c_count') {
  if (column) {
    return sql<number>`count(${column})`.as(alias); // In MySQL cast to unsigned integer
  }
  else {
    return sql<number>`count(*)`.as(alias); // In MySQL cast to unsigned integer
  }
}
