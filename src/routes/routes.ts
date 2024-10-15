import type { Router } from 'express';
import { createRouter } from '../utils/create';
import adminRoutes from './admin';
import userRoutes from './user';
import regionRoutes from './region';
import aliossRoutes from './alioss';
import resourceRoutes from './resource';

export default createRouter((router: Router) => {
  router.use('/admin', adminRoutes);
  router.use('/user', userRoutes);
  router.use("/region", regionRoutes);
  router.use("/ali", aliossRoutes),
  router.use("/resource", resourceRoutes)
});
