import type { GetItemByIdType } from '../schema/travel';
import { deleteSchema, getItemByIdSchema, newSchema, selectSchema, statisticsSchama, updateSchema } from '../schema/travel';
import type { SelectItemsType } from '../schema/travel';
import { ItemType } from '../schema/user';
import {
  addItem,
  deleteItem,
  getItemById,
  getItems,
  statisticsItems,
  updateItem,
} from '../services/travel';
import { createHandler } from '../utils/create';

export const addItemHandler = createHandler(newSchema, async (req, res) => {
  const data = req.body;

  const user = res.locals.user as ItemType;
  if (user && user.account) {
    // @ts-ignore
    data.user = user.account;
  }


  const result = await addItem(data);

  // if (Array.isArray(data.tags) && data.tags.length > 0) {
  //   const ttags = data.tags.map(t => ({
  //     tagId: t,
  //     travelId: result.insertId,
  //   }))
  //   await addItems(ttags);
  // }


  res.status(200).json({
    code: 0,
    data: result.insertId,
  });
});

export const deleteHandler = createHandler(deleteSchema, async (req, res) => {
  const { id } = req.body;

  const deletedUser = await deleteItem(id);

  res.status(200).json({
    data: deletedUser,
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

  const updatedUser = await updateItem(data);
  // await deleteByTravelId(data.id!)

  // if (Array.isArray(data.tags) && data.tags.length > 0) {
  //   const ttags = data.tags.map(t => ({
  //     tagId: t,
  //     travelId: data.id!,
  //   }))
  //   await addItems(ttags);
  // }

  res.status(200).json({
    data: updatedUser,
    code: 0,
  });
});

export const statisticsHandler = createHandler(statisticsSchama, async (req, res) => {
  const options = req.query;

  const updatedItem = await statisticsItems(options);

  res.status(200).json({
    data: updatedItem,
    code: 0,
  });
});
