import type { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { createRouter } from '../utils/create';
import { submitMediaProducingHandler, submitTravelMediaProducingHandler } from '../controllers/ice';
import iceClientProxy from '../lib/ICEClientProxy';

export default createRouter((router: Router) => {
  router.use(
    authenticate({
      verifyAdmin: false,
    }),
  );

  router.post('/submitMediaProducing', submitMediaProducingHandler);

  router.post('/submitTravelMediaProducing', submitTravelMediaProducingHandler);

  router.get("/proxy/get", async (req, res) => {

    try {
      const { Action, ...params } = req.query;
      const data = await iceClientProxy.requestICEGet(Action as string, params);
      return res.json({
        code: 0,
        data
      })
    } catch (err: any) {
      return res.json({
        code: 40010,
        message: err.message ||  err.data.message,
        data: err.data
      })
    }
  })

  router.post("/proxy/post", async (req, res) => {
    try {
      const { Action, ...params } = req.body;
      const data = await iceClientProxy.requestICEPost(Action, params);
      return res.json({
        code: 0,
        data
      })
    } catch (err: any) {
      return res.json({
        code: 40010,
        message: err.message ||  err.data.message,
        data: err.data
      })
    }
  })

});
