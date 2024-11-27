import type { GetItemByIdType, SelectItemsType } from '../schema/school';
import { deleteSchema, getItemByIdSchema, newSchema, selectSchema, statisticsSchama, updateSchema } from '../schema/school';
import {
  addItem,
  deleteItem,
  getItemById,
  getItems,
  statisticsItems,
  updateItem,
} from '../services/school';
import { createHandler } from '../utils/create';

export const addItemHandler = createHandler(newSchema, async (req, res) => {
  const data = req.body;

  const result = await addItem(data);

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
  const pager = req.query as SelectItemsType;

  const data = await getItems(pager as any);

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
