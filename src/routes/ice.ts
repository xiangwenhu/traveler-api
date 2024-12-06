import type { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { createRouter } from '../utils/create';
import { submitMediaProducingHandler } from '../controllers/ice';

export default createRouter((router: Router) => {
  router.use(
    authenticate({
      verifyAdmin: false,
    }),
  );

  router.post('/submitMediaProducing', submitMediaProducingHandler);
});
