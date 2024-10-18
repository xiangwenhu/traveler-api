import type { Router } from 'express';
import {
  addItemHandler,
  deleteHandler,
  updateHandler,
  loginHandler,
} from '@/controllers/user';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.post('/login', loginHandler);

  router.post('/create', authenticate(), addItemHandler);
  router.post('/delete', authenticate(), deleteHandler);
  router.put('/update', authenticate(), updateHandler);
});
