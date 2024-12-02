import http from 'node:http';
import consola from 'consola';
import type express from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { createRouter } from '../utils/create';
import { EnumErrorCode } from '../utils/errors';
import { authenticate } from '../middlewares/auth';

export default function useProxy(app: express.Express) {
  app.use('/api/proxy/geo', authenticate({
    verifyAdmin: false
  }), createProxyMiddleware({
    target: 'https://geo.datav.aliyun.com',
    changeOrigin: true,
    selfHandleResponse: true,
    headers: {
      "host": "localhost:3000",
      origin: "http://localhost:3001",
      referer: "http://localhost:3001/"
    },
    pathRewrite(path) {
      console.info('path:', path);
      return path.replace('/api/proxy/geo', '');
    },
    onProxyRes: responseInterceptor(async (responseBuffer, _proxyRes, _req, _res) => {
      try {
        const resText = responseBuffer.toString('utf8');
        console.log("resText:", resText);
        const data = JSON.parse(resText);
        return JSON.stringify({
          code: 0,
          data,
        });
      }
      catch (err: any) {
        consola.error('onProxyRes error:', err);
        return JSON.stringify({
          code: EnumErrorCode.PROXY_ERROR,
          message: err & err.message,
        });
      }
    }),

  }));



  app.use('/api/proxy/map',
    // authenticate({
    //   verifyAdmin: false
    // }),
    createProxyMiddleware({
      target: 'https://restapi.amap.com',
      changeOrigin: true,
      // selfHandleResponse: true,
      // headers: {
      //   "host": "localhost:3000",
      //   origin: "http://localhost:3001",
      //   referer: "http://localhost:3001/"
      // },
      pathRewrite(path) {
        console.info('path:', path);
        const targetPath = path.replace('/api/proxy/map', '') + `&key=${process.env.AMAP_KEY}`;
        console.info('targetPath:', targetPath);
        return targetPath;
      },
      // onProxyRes: responseInterceptor(async (responseBuffer, _proxyRes, _req, _res) => {
      //   try {
      //     const resText = responseBuffer.toString('utf8');
      //     console.log("resText:", resText);
      //     const data = JSON.parse(resText);
      //     return JSON.stringify({
      //       code: 0,
      //       data,
      //     });
      //   }
      //   catch (err: any) {
      //     consola.error('onProxyRes error:', err);
      //     return JSON.stringify({
      //       code: EnumErrorCode.PROXY_ERROR,
      //       message: err & err.message,
      //     });
      //   }
      // }),

    }));

}
