import type { Router } from 'express';
import { createRouter } from '../utils/create';
import adminRoutes from './admin-routes';
import userRoutes from './user-routes';
import regionRoutes from './region-routes';

export default createRouter((router: Router) => {
  router.use('/admin', adminRoutes);
  router.use('/user', userRoutes);
  router.use("/region", regionRoutes)
});
