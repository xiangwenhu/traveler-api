import { SelectRegionSchema } from '@/schema/region';
import {
    getRegions
} from '@/services/region-service';
import { createHandler } from '@/utils/create';

export const handleGetRegions = createHandler(SelectRegionSchema, async (req, res) => {
    const { parentCode } = req.body;

    const items = await getRegions(parentCode || 0);
    res.status(200).json({
        items,
    });
});
