import type {
    SelectItemsType
} from '../schema/iceJob';
import {
    deleteSchema,
    newSchema,
    updateSchema,
} from '../schema/iceJob';

import {
    addItem,
    deleteItem,
    getItems,
    updateItem,
} from '../services/iceJob';
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

  const deletedItem = await deleteItem(id);

  res.status(200).json({
    code: 0,
    data: deletedItem,
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

  const updatedItem = await updateItem(user);

  res.status(200).json({
    code: 0,
    data: updatedItem,
  });
});
