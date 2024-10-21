import { PCA_CHINA_CODE } from '@/const';
import { selectSchema } from '@/schema/region';
import {
    getItems
} from '@/services/region';
import { createHandler } from '@/utils/create';

export const getItemsHandler = createHandler(selectSchema, async (req, res) => {
    const { parentCode } = req.query;

    const data = await getItems(+parentCode || PCA_CHINA_CODE);
    res.status(200).json({
        data,
        code: 0
    });
});
