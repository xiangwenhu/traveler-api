import { ItemType as User } from '../schema/user';
import { getItemByAccount, getItemById } from '../services/user';
import { createHandler } from '../utils/create';
import { BackendError, EnumErrorCode } from '../utils/errors';
import { verifyToken } from '../utils/jwt';
import { type Request } from 'express';

const WhitelistAPIS: string[] = [
  "/api/login",
  "/api/ice",
  '/api/travel/update'
];

const methodList = ["GET", "OPTIONS", 'HEAD'];


function checkPermission(user: User, req: Request) {
  // 不是只读用户，直接返回
  if (!user.readonly) {
    return true;
  }

  const originalUrl = req.originalUrl;

  console.log('originalUrl:', originalUrl);
  if (WhitelistAPIS.some(api => originalUrl.startsWith(api))) {
    return true;
  }

  // 
  const method = req.method.toUpperCase();
  if (methodList.includes(method)) {
    return true;
  }

  throw new Error('只读用户，无限操作');
}



export function authenticate({ verifyAdmin } = {
  verifyAdmin: false,
}) {
  return createHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new BackendError(EnumErrorCode.UNAUTHORIZED, {
        message: 'Authorization header not found',
      });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new BackendError(EnumErrorCode.UNAUTHORIZED, {
        message: 'Token not found',
      });
    }

    const { account } = verifyToken(token);

    const user = await getItemByAccount(account);

    if (!user)
      throw new BackendError(EnumErrorCode.NOT_FOUND);

    if (verifyAdmin && !user.isAdmin) {
      throw new BackendError(EnumErrorCode.FORBIDDEN, {
        message: '未授权访问',
      });
    }

    checkPermission(user, req);

    res.locals.user = user;
    next();
  });
}
