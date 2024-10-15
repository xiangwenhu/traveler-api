import { selectSchema } from '@/schema/region';
import {
    getItems
} from '@/services/region';
import { createHandler } from '@/utils/create';

export const getItemsHandler = createHandler(selectSchema, async (req, res) => {
    const { parentCode } = req.body;

    const items = await getItems(parentCode || 0);
    res.status(200).json({
        items,
    });
});
