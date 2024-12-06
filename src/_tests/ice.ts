import { SubmitMediaProducingJobRequest } from "@alicloud/ice20201109";
import UrlBaseTimelineBuilder from "../lib/timline/UrlBaseTimelineBuilder";
import { Timeline } from "../types/ice";
import '../utils/env';
import iceClient from "../lib/ICEClient";

; (async function () {


   const timelineBuilder = new UrlBaseTimelineBuilder(iceClient);

    const urls = [
        'https://traveler-traveler.oss-cn-beijing.aliyuncs.com/travel/marker_green.jpg',
        'https://traveler-traveler.oss-cn-beijing.aliyuncs.com/travel/fff.mp4',
        'https://traveler-traveler.oss-cn-beijing.aliyuncs.com/travel/%E9%87%8E%E5%B1%B1%E5%9D%A1.jpg',
        'https://traveler-traveler.oss-cn-beijing.aliyuncs.com/travel/ddd.mp4',
        'https://traveler-traveler.oss-cn-beijing.aliyuncs.com/travel/ccc.mp4',
        'https://traveler-traveler.oss-cn-beijing.aliyuncs.com/travel/%E5%A4%A9%E6%B4%A5-%E6%9D%A8%E6%9F%B3%E9%9D%92.png'
    ]

    await timelineBuilder.addVideoTracksByUrls(urls, {
        imageDuration: 3,
        useTransition: true,
        transitionDuration: 1,
        mainTrack: true,
        transitionList: [Timeline.SubTypeTransition.windowslice]
    });

    timelineBuilder.addAudioTrackByUrl("https://traveler-traveler.oss-cn-beijing.aliyuncs.com/music/1c1c9684-0d30-4ce6-91d5-4c6973077182.mp3", {
        LoopMode: true
    })

    const timeline = timelineBuilder.build();

    console.log("timeline", JSON.stringify(timeline, undefined, "\t"));


    const submitRequest = new SubmitMediaProducingJobRequest();
    submitRequest.timeline = JSON.stringify(timeline),
    submitRequest.outputMediaConfig = JSON.stringify({
        "Height": 540,
        "Width": 960,
        "MediaURL": `http://traveler-traveler.oss-cn-beijing.aliyuncs.com/works/混合剪辑_12-16_12-05.mp4`
    }
    )

   const res = await timelineBuilder.iceClient.submitMediaProducingJob(submitRequest)

   console.log("res:", res);
})();