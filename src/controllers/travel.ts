import type { GetItemByIdType } from '../schema/travel';
import { deleteSchema, getItemByIdSchema, newSchema, selectSchema, setCoverSchema, statisticsSchema, updateSchema } from '../schema/travel';
import type { SelectItemsType } from '../schema/travel';
import { ItemType } from '../schema/user';
import { getByTravelId } from '../services/resource';
import {
  addItem,
  deleteItem,
  getItemById,
  getItems,
  statisticsItems,
  updateItem,
} from '../services/travel';
import getOSSClient from '../utils/aliOSSClient';
import { createHandler } from '../utils/create';
import { addItem as addResourceItem, deleteItem as deleteResourceItem } from '../services/resource';

export const addItemHandler = createHandler(newSchema, async (req, res) => {
  const data = req.body;

  const item = res.locals.user as ItemType;
  if (item && item.account) {
    // @ts-ignore
    data.user = item.account;
  }

  const result = await addItem(data);

  addResourceItem({
    travelId: result.insertId,
    url: data.cover!,
    title: data.title,
    type: "image",
    duration: 0,
    size: 0,
    width: 0,
    height: 0,
  })

  res.status(200).json({
    code: 0,
    data: result.insertId,
  });
});

export const deleteHandler = createHandler(deleteSchema, async (req, res) => {
  const { id } = req.body;

  const travel = await getItemById(id);

  if (!travel) throw new Error("旅行不存在");

  const ossClient = await getOSSClient();

  // 获取资源
  const resourcesItems = await getByTravelId({
    travelId: +id,
    pageNum: '1',
    pageSize: '2000'
  });

  // 资源大于0，删除资源
  if (resourcesItems.total > 0) {
    for (let i = 0; i < resourcesItems.list.length; i++) {
      const r = resourcesItems.list[i];
      const url = r!.url.split("com/")[1];
      await ossClient.delete(url!);
    }
  }

  // TODO:: 删除合成的视频
  // const videos = travel.works;

  // 删除旅行
  const deletedItem = await deleteItem(id);

  res.status(200).json({
    data: deletedItem,
    code: 0,
  });
});

export const getItemsHandler = createHandler(selectSchema, async (req, res) => {
  // @ts-ignore
  const options = req.query as SelectItemsType;

  const user = res.locals.user as ItemType;
  // if(user && user.account){
  //   options.user = user.account;
  // }
  const accounts = [user.account, ...(user.associateUsers as string[] || [])];

  const data = await getItems(options as any, accounts);

  res.status(200).json({
    code: 0,
    data,
  });
});

export const getItemByIdHandler = createHandler(getItemByIdSchema, async (req, res) => {
  const query = req.query as GetItemByIdType;

  const data = await getItemById(+query.id);

  res.status(200).json({
    code: 0,
    data,
  });
});

export const updateHandler = createHandler(updateSchema, async (req, res) => {
  const data = req.body;

  const { id } = data;

  if (!id) throw new Error(`缺少必要参数id`);

  const travel = await getItemById(data.id!);
  if (!travel) throw new Error("旅行不存在");

  if (data.cover && data.cover !== travel.cover) {
    addResourceItem({
      travelId: id,
      url: data.cover!,
      title: data.title || travel.title,
      type: "image",
      duration: 0,
      size: 0,
      width: 0,
      height: 0,
    });
  }

  const updatedItem = await updateItem(data);

  res.status(200).json({
    data: updatedItem,
    code: 0,
  });
});

export const statisticsHandler = createHandler(statisticsSchema, async (req, res) => {
  const options = req.query;

  const updatedItem = await statisticsItems(options);

  res.status(200).json({
    data: updatedItem,
    code: 0,
  });
});


export const setCoverHandler = createHandler(setCoverSchema, async (req, res) => {
  const data = req.body;

  const { id } = data;

  if (!id) throw new Error(`缺少必要参数id`);

  const travel = await getItemById(data.id!);
  if (!travel) throw new Error("旅行不存在");

  const updateData = {
      id,
      cover: data.cover
  }


  const updatedItem = await updateItem(updateData);

  res.status(200).json({
    data: updatedItem,
    code: 0,
  });
});