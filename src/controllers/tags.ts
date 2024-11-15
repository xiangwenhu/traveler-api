import type {
    SelectItemsType
} from '../schema/tags';
import {
    deleteSchema,
    newSchema,
    updateSchema,
} from '../schema/tags';

import {
    addItem,
    deleteItem,
    getItems,
    updateItem,
} from '../services/tags';
import { createHandler } from '../utils/create';


export const addItemHandler = createHandler(newSchema, async (req, res) => {
  const item = req.body;

  await addItem(item);

  res.status(201).json({
    code: 0,
  });
});

export const deleteHandler = createHandler(deleteSchema, async (req, res) => {
  const { id } = req.body;

  const deletedUser = await deleteItem(id);

  res.status(200).json({
    code: 0,
    data: deletedUser,
  });
});

export const getItemsHandler = createHandler(async (req, res) => {
  const pager = req.query as SelectItemsType;

  const data = await getItems(pager);

  res.status(200).json({
    code: 0,
    data,
  });
});

export const updateHandler = createHandler(updateSchema, async (req, res) => {
  const user = req.body;

  const updatedUser = await updateItem(user);

  res.status(200).json({
    code: 0,
    data: updatedUser,
  });
});
