
import { deleteSchema, newSchema, updateSchema, schema, selectSchema, SelectItemsType } from '@/schema/resource';
import {
 addItem,
 updateItem,
 deleteItem,
 getItems,
} from '@/services/resource';
import { createHandler } from '@/utils/create';


export const addItemHandler = createHandler(newSchema, async (req, res) => {
  const user = req.body;
  await addItem(user);
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

export const getItemsHandler = createHandler(selectSchema,  async (req, res) => {
  const selectOptions = req.query as SelectItemsType;

  const data = await getItems(selectOptions);

  res.status(200).json({
    code: 0,
    data 
  });
});

export const updateHandler = createHandler(updateSchema, async (req, res) => {

  const user = req.body;

  const data = await updateItem(user);

  res.status(200).json({
    data,
    code: 0
  });
});