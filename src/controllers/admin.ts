import {
  getItems,
} from '@/services/admin';
import { createHandler } from '@/utils/create';

export const getItemsHandler = createHandler(async (_req, res) => {
  const data = await getItems();
  res.status(200).json({
    code: 0,
    data
  });
});
