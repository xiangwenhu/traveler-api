import { SubmitMediaProducingJobRequest } from "@alicloud/ice20201109";
import UrlBaseTimelineBuilder from "../lib/timline/UrlBaseTimelineBuilder";
import { MediaProducingOptions, Timeline } from "../types/ice";
import '../utils/env';
import { randomUUID } from "crypto";
import iceClient from "../lib/ICEClient";


export async function submitMediaProducing(data: MediaProducingOptions) {

    const {
        video,
        bgMusic,
        output
    } = data;

    const { urls } = video;


    const timelineBuilder = new UrlBaseTimelineBuilder(iceClient);

    await timelineBuilder.addVideoTracksByUrls(urls, video.options || {});

    if (bgMusic && bgMusic.url) {
        timelineBuilder.addAudioTrackByUrl(bgMusic.url, bgMusic.options || {})
    }

    const timeline = timelineBuilder.build();

    console.log("timeline", JSON.stringify(timeline, undefined, "\t"));


    const uid = randomUUID();
    output.MediaURL = `${process.env.ALI_OSS_T_BUCKET_ROOT}/works/${uid}___${output.FileName}`;

    const req = new SubmitMediaProducingJobRequest();
    req.timeline = JSON.stringify(timeline),
        req.outputMediaConfig = JSON.stringify(output)

    if (data.userData) {
        req.userData = JSON.stringify(data.userData);
    }

    const res = await timelineBuilder.iceClient.submitMediaProducingJob(req)

    console.log("res:", res);

    return res.body;
}