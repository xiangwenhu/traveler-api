
import { deleteSchema, newSchema, updateSchema } from '@/schema/travel';
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

  res.status(201).json(user);
});


export const deleteHandler = createHandler(deleteSchema, async (req, res) => {
  const { id } = req.body;

  const deletedUser = await deleteItem(id);

  res.status(200).json({
    user: deletedUser,
  });
});

export const getItemsHandler = createHandler(async (req, res) => {
  // @ts-ignore
  const pager = req.query as PagerParams;

  const users = await getItems(pager);

  res.status(200).json(users);
});

export const updateHandler = createHandler(updateSchema, async (req, res) => {

  const user = req.body;

  const updatedUser = await updateItem(user);

  res.status(200).json({
    user: updatedUser,
  });
});