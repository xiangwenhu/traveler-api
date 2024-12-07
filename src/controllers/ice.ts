import { submitMediaProducing } from '../services/ice';
import { addItem } from '../services/iceJob';
import { getItemById, updateItem } from '../services/travel';
import { MediaProducingOptions } from '../types/ice';
import { createHandler } from '../utils/create';
import { BackendError, EnumErrorCode } from '../utils/errors';

export const submitMediaProducingHandler = createHandler(async (req, res) => {
    const data = req.body as MediaProducingOptions;

    const r = await submitMediaProducing(data);

    res.json({
        code: 0,
        data: r
    })
});


export const submitTravelMediaProducingHandler = createHandler(async (req, res) => {
    const data = req.body as MediaProducingOptions & {
        travelId: number;
    };

    if (!data.travelId) {
        throw new BackendError(EnumErrorCode.PARAM_ERROR, {
            message: 'travelId 参数缺失',
        });
    }

    const travel = await getItemById(data.travelId);

    if (!travel) {
        throw new BackendError(EnumErrorCode.NOT_FOUND, {
            message: '未找到对应的travel记录',
        });
    }

    // 提交生产
    const r = await submitMediaProducing(data);    

    // 作业添加
    await addItem({
        jobId: r!.jobId!,
        status: 0,
        type: 1,
        associationIds: [travel.id]
    })

    res.json({
        code: 0,
        data: r
    })
});
