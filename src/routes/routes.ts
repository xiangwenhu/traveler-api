import type { Router } from 'express';
import { createRouter } from '../utils/create';
import adminRoutes from './admin';
import userRoutes from './user';
import regionRoutes from './region';
import aliossRoutes from './alioss';
import resourceRoutes from './resource';
import travelRoutes from './travel';
import tagsRoutes from "./tags"

export default createRouter((router: Router) => {
  router.use('/admin', adminRoutes);
  router.use('/user', userRoutes);
  router.use('/region', regionRoutes);
  router.use('/ali', aliossRoutes);
  router.use('/resource', resourceRoutes);
  router.use('/travel', travelRoutes);
  router.use("/tags", tagsRoutes)
});
