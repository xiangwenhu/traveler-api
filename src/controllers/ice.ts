import { submitMediaProducing } from '../services/ice';
import { MediaProducingOptions } from '../types/ice';
import { createHandler } from '../utils/create';

export const submitMediaProducingHandler = createHandler(async (req, res) => {
    const data = req.body as MediaProducingOptions;

    const r = await submitMediaProducing(data);

    res.json({
        code: 0,
        data: r
    })
});
