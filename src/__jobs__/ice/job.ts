import { GetMediaProducingJobRequest } from "@alicloud/ice20201109";

import { ItemType } from "../../schema/iceJob";
import { getItems as getJobItems, updateItem as updateJobItem } from "../../services/iceJob";
import { updateItem as updateTravelItem, getItemById as getTravelById } from "../../services/travel";
import iceClient from "../../lib/ICEClient";



async function syncData(item: ItemType) {

    const travelIds: number[] = item.associationIds as number[] || [];

    if (travelIds.length == 0) return;


    // 查询任务状态
    const req: GetMediaProducingJobRequest = new GetMediaProducingJobRequest();
    req.jobId = item.jobId;
    const res = await iceClient.getMediaProducingJob(req);
    if (res.statusCode != 200) {
        await updateJobItem({
            id: item.id,
            status: 99,
            message: res.body?.mediaProducingJob?.message || '未知错误'
        })
        return;
    }


    const mediaUrl = res.body!.mediaProducingJob!.mediaURL;

    for (let i = 0; i < travelIds.length; i++) {
        const travelId = travelIds[i]!;

        const travel = await getTravelById(travelId);
        if (!travel) continue;

        const works: any[] = travel.works as any[] || [];


        const userDataStr = res.body?.mediaProducingJob?.userData;
        const userData = typeof userDataStr == 'string' ? JSON.parse(userDataStr) : {} as any;


        works.push({
            title: userData.title || travel.title,
            url: mediaUrl
        })

        await updateTravelItem({
            id: travelId,
            works
        })

        await updateJobItem({
            id: item.id,
            status: 1,
            message: '完成'
        })
    }
}


export default async function job() {
    try {
        const res = await getJobItems({
            // 初始化
            status: 0,
            pageNum: '1',
            pageSize: '1000',
            // 视频剪辑
            type: 1
        });

        if (res.list.length == 0) return console.log(`暂无作业需要处理`);

        console.log("需要同步的作业:", res.list.length);


        for (let i = 0; i < res.list.length; i++) {
            const item = res.list[i];
            try {
                console.log(`同步开始：${i+1}/${res.list.length}`);
                await syncData(item!);
                console.log(`同步完成：${i+1}/${res.list.length}`);
            } catch (err: any) {
                console.error("ICE syncData 失败", item);
            }
        }

    } catch (err) {
        console.error("ICE Job error:", err);
    }
}
