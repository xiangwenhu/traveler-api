import type { Router } from 'express';
import {
  getItemsHandler,
} from '@/controllers/admin';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  // router.use(
  //   authenticate({
  //     verifyAdmin: true,
  //   }),
  // );

  router.get('/getItems', getItemsHandler);
});
