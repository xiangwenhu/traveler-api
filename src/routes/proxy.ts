import http from 'node:http';
import consola from 'consola';
import type express from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { createRouter } from '../utils/create';
import { EnumErrorCode } from '../utils/errors';

export default function useProxy(app: express.Express) {
  app.use('/api/proxy/geo', createProxyMiddleware({
    target: 'https://geo.datav.aliyun.com',
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite(path) {
      console.info('path:', path);
      return path.replace('/api/proxy/geo', '');
    },
    onProxyRes: responseInterceptor(async (responseBuffer, _proxyRes, _req, _res) => {
      try {
        const data = JSON.parse(responseBuffer.toString('utf8'));
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
}
