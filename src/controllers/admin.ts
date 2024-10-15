import {
  getItems,
} from '@/services/admin';
import { createHandler } from '@/utils/create';

export const getItemsHandler = createHandler(async (_req, res) => {
  const users = await getItems();
  res.status(200).json({
    users,
  });
});
