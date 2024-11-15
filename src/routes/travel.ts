import type { Router } from 'express';
import {
  addItemHandler,
  deleteHandler,
  getItemByIdHandler,
  getItemsHandler,
  statisticsHandler,
  updateHandler,
} from '../controllers/travel';
import { authenticate } from '../middlewares/auth';
import { createRouter } from '../utils/create';

export default createRouter((router: Router) => {
  router.use(
    authenticate({
      verifyAdmin: false,
    }),
  );

  router.post('/create', addItemHandler);
  router.get('/getItems', getItemsHandler);
  router.post('/delete', deleteHandler);
  router.put('/update', updateHandler);
  router.get('/statistics', statisticsHandler);
  router.get('/getItemById', getItemByIdHandler);
});
