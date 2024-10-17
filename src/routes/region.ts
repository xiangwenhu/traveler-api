import type { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';
import { getItemsHandler } from '@/controllers/region';

export default createRouter((router: Router) => {
  // router.use(
  //   authenticate({
  //     verifyAdmin: false,
  //   }),
  // );

  router.get('/getItems', getItemsHandler);
});
