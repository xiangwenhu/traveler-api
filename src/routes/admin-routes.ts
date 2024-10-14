import type { Router } from 'express';
import {
  handleGetAllUsers,
} from '@/controllers/admin-controllers';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.use(
    authenticate({
      verifyAdmin: true,
    }),
  );

  router.get('/all-users', handleGetAllUsers);
});
