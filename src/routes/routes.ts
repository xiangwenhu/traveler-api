import type { Router } from 'express';
import { createRouter } from '../utils/create';
import adminRoutes from './admin';
import userRoutes from './user';
import regionRoutes from './region';
import aliossRoutes from './alioss';
import resourceRoutes from './resource';
import travelRoutes from './travel';
import tagsRoutes from "./tags"
import AAAAARoutes from "./5AScenic"
import schoolRoutes from './school';
import iceRoutes from './ice';
import iceJob from './iceJob';

export default createRouter((router: Router) => {
  router.use('/admin', adminRoutes);
  router.use('/user', userRoutes);
  router.use('/region', regionRoutes);
  router.use('/ali', aliossRoutes);
  router.use('/resource', resourceRoutes);
  router.use('/travel', travelRoutes);
  router.use("/tags", tagsRoutes)
  router.use("/5A", AAAAARoutes);
  router.use("/school", schoolRoutes),
  router.use("/ice", iceRoutes),
  router.use("/iceJob", iceJob)
});
