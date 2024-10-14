import type { Router } from 'express';
import {
  handleAddUser,
  handleDeleteUser,
  handleUpdateUser,
  handleUserLogin,
} from '@/controllers/user-controllers';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.post('/create', handleAddUser);
  router.post('/login', handleUserLogin);
  router.post('/remove', authenticate(), handleDeleteUser);
  router.put('/update', authenticate(), handleUpdateUser);
});
