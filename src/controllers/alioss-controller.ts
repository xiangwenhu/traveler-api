import { assumeRole } from '@/utils/ali-oss';
import { createHandler } from '@/utils/create';

export const handleAssumeRole = createHandler(async (_req, res) => {
    const credentials = await assumeRole();
    res.status(200).json(credentials);
});
