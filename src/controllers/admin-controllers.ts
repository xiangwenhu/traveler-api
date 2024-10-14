import {
  getAllUsers,
} from '@/services/admin-services';
import { createHandler } from '@/utils/create';

export const handleGetAllUsers = createHandler(async (_req, res) => {
  const users = await getAllUsers();
  res.status(200).json({
    users,
  });
});
