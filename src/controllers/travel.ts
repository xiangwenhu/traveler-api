
import { deleteSchema, newSchema, selectSchema, updateSchema } from '@/schema/travel';
import { SelectItemsType } from '@/schema/user';
import {
 addItem,
 updateItem,
 deleteItem,
 getItems,
} from '@/services/travel';
import type { PagerParams } from '@/types/service';
import { createHandler } from '@/utils/create';

export const addItemHandler = createHandler(newSchema, async (req, res) => {
  const user = req.body;

  await addItem(user);

  res.status(201).json({
    code: 0
  });
});


export const deleteHandler = createHandler(deleteSchema, async (req, res) => {
  const { id } = req.body;

  const deletedUser = await deleteItem(id);

  res.status(200).json({
    data: deletedUser,
    code: 0
  });
});

export const getItemsHandler = createHandler(selectSchema, async (req, res) => {
  // @ts-ignore
  const pager = req.query as SelectItemsType;

  const data = await getItems(pager);

  res.status(200).json({
    code: 0,
    data
  });
  
});

export const updateHandler = createHandler(updateSchema, async (req, res) => {

  const user = req.body;

  const updatedUser = await updateItem(user);

  res.status(200).json({
    data: updatedUser,
    code: 0
  });
});