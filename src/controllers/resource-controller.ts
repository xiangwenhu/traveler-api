
import { newResourceSchema } from '@/schema/resource';
import {
 addResource,
 updateResource,
 getByTraverlId,
 deleteResource
} from '@/services/resource-service';
import type { PagerParams } from '@/types/service';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';
import generateToken from '@/utils/jwt';


export const handleAddResource = createHandler(newResourceSchema, async (req, res) => {
  const user = req.body;

  await addResource(user);

  res.status(201).json(user);
});

