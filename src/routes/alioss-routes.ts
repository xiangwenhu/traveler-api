import type { Router } from 'express';
import { authenticate } from '@/middlewares/auth';
import { createRouter } from '@/utils/create';
import { handleAssumeRole } from '@/controllers/alioss-controller';

export default createRouter((router: Router) => {
//   router.use(
//     authenticate({
//       verifyAdmin: false,
//     }),
//   );

  router.post('/getSTSToken', handleAssumeRole);
});
