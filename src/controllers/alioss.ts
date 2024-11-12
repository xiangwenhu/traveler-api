import { assumeRole } from '../utils/ali-oss';
import { createHandler } from '../utils/create';

export const assumeRoleHandler = createHandler(async (_req, res) => {
  const credentials = await assumeRole();
  res.status(200).json({
    code: 0,
    data: credentials,
  });
});
