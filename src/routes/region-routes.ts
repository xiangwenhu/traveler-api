import type { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';
import { handleGetRegions } from '@/controllers/region-controller';

export default createRouter((router: Router) => {
  // router.use(
  //   authenticate({
  //     verifyAdmin: true,
  //   }),
  // );

  router.post('/getRegions', handleGetRegions);
});
