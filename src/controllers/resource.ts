import type { SelectItemsType } from '../schema/resource';
import { deleteSchema, newSchema, schema, selectSchema, updateSchema } from '../schema/resource';
import {
  addItem,
  deleteItem,
  getByTraverlId,
  getItems,
  updateItem,
} from '../services/resource';
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

export const getItemsHandler = createHandler(selectSchema, async (req, res) => {
  const selectOptions = req.query as SelectItemsType;

  const data = await getByTraverlId(selectOptions);

  res.status(200).json({
    code: 0,
    data,
  });
});

export const updateHandler = createHandler(updateSchema, async (req, res) => {
  const body = req.body;

  const data = await updateItem(body);

  res.status(200).json({
    data,
    code: 0,
  });
});
