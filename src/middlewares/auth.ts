import { getItemByAccount, getItemById } from '../services/user';
import { createHandler } from '../utils/create';
import { BackendError, EnumErrorCode } from '../utils/errors';
import { verifyToken } from '../utils/jwt';

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
      throw new BackendError(EnumErrorCode.USER_NOT_FOUND);

    if (verifyAdmin && !user.isAdmin) {
      throw new BackendError(EnumErrorCode.UNAUTHORIZED, {
        message: 'User not authorized',
      });
    }

    res.locals.user = user;
    next();
  });
}
