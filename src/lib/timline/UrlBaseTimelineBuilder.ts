import { BatchGetMediaInfosRequest, RegisterMediaInfoRequest } from "@alicloud/ice20201109";
import { isImage, isVideo } from "../../utils/media";
import iceClient, { ICEClient } from "../ICEClient";
import TimelineBuilder from "./TimelineBuilder";
import { VideoMediaInfo, VideoTrackOptions } from "./type";
import { arrayToRecord } from "../../utils/index";
import _ from "lodash";
import { Timeline } from "../../types/ice";
import * as util from "./util";
import { TRANSITION_LIST } from "../../const";


export default class UrlBaseTimelineBuilder extends TimelineBuilder {

    constructor(public iceClient: ICEClient) {
        super()
    }

    async addVideoTracksByUrls(urls: string[], options: VideoTrackOptions) {
        const track = await this.buildVideoTrack(urls, options);
        super.addVideoTracks(track);
    }

    async addAudioTrackByUrl(url: string, options: Pick<Timeline.AudioTrackClip, "LoopMode">) {
        const trackClip = this.buildAudioTrackClip(url, options);
        const track: Timeline.AudioTrack = {
            AudioTrackClips: [trackClip]
        }
        super.addAudioTracks(track)
    }


    //#region 私有方法

    private async buildVideoTrack(urls: string[], options: VideoTrackOptions) {
        // 过滤图视频地址
        const videoUrls = urls.filter(url => isVideo(url));
        // 获取视频信息
        const videoMediaInfos = await this.ensureVideoFileInfos(videoUrls);
        // 转 map
        const videoMediaMap = arrayToRecord(videoMediaInfos, "url");

        let VideoTrackClips: Timeline.VideoTrackClip[];

        // 第一个图片和视频，不使用转场
        let isFirst = true;

        // 不使用转场
        if (!options.useTransition) {
            VideoTrackClips = urls.map(url => {
                const isImg = isImage(url);
                if (isImg) return this.buildImageTrackClip(url, {
                    Duration: options.imageDuration || 3,
                });
                if (isVideo(url) && videoMediaMap[url]) {
                    return this.buildVideoTrackClip(url)
                }
                return undefined
            }).filter(Boolean) as Timeline.AudioTrackClip[];

            const track: Timeline.VideoTrack = {
                Type: "Video",
                VideoTrackClips,
                MainTrack: options.mainTrack || false
            }
            return track;
        }

        // 使用转场
        let nextTimeIn = 0;
        const { imageDuration, transitionDuration = 1 } = options;
        const imageDurationStep = imageDuration - transitionDuration;
        const transitionList = options.transitionList || TRANSITION_LIST;

        VideoTrackClips = [];
        let Id = 1; // Math.round( Date.now() + performance.now());

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i]!;

            // 随机转场效果
            const effect = util.getTransitionEffect(transitionList, {
                Duration: options.transitionDuration || 1,
                From: VideoTrackClips[VideoTrackClips.length - 1]?.Id,
                Id
            });

            Id++;

            const isImg = isImage(url);
            if (isImg) {

                const TimelineIn = nextTimeIn;
                const TimelineOut = util.getTimeValue(nextTimeIn + imageDuration);
                nextTimeIn = util.getTimeValue(nextTimeIn + imageDurationStep);

                const Effects = isFirst ? [] : [effect];
                isFirst = false;
                const track = this.buildImageTrackClip(url, {
                    Id,
                    // Duration: options.imageDuration || 3,
                    TimelineIn,
                    TimelineOut,
                    Effects
                });
                VideoTrackClips.push(track)
            }

            if (isVideo(url) && videoMediaMap[url]) {
                const videoInfo = videoMediaMap[url]!;
                const TimelineIn = nextTimeIn;

                const Duration = videoInfo.data!.duration!;
                const TimelineOut = util.getTimeValue(nextTimeIn + Duration);
                nextTimeIn = util.getTimeValue(nextTimeIn + Duration - transitionDuration);

                const Effects = isFirst ? [] : [effect];
                isFirst = false;
                const track = this.buildVideoTrackClip(url, {
                    Id,
                    TimelineIn,
                    TimelineOut,
                    Effects,
                    In: 0,
                    Out: Duration,
                    // Duration,
                    VirginDuration: Duration,
                });
                VideoTrackClips.push(track)
            }
            continue;
        }


        const track: Timeline.VideoTrack = {
            Type: "Video",
            VideoTrackClips,
            MainTrack: options.mainTrack || false
        }
        return track;
    }


    private async ensureVideoFileInfos(urls: string[]): Promise<VideoMediaInfo[]> {
        const fUrls = urls.filter(url => isVideo(url));
        if (fUrls.length == 0) return [];
        const results: VideoMediaInfo[] = [];

        // 批量注册
        for (let i = 0; i < fUrls.length; i++) {
            const url = fUrls[i]!;
            try {
                const req = new RegisterMediaInfoRequest();
                req.inputURL = url;
                req.overwrite = true;
                const res = await this.iceClient.registerMediaInfo(req);

                if (res.statusCode == 200) {
                    results.push({
                        url,
                        mediaId: res.body?.mediaId
                    })
                    continue;
                }
                results.push({
                    url
                })
            } catch (err) {
                results.push({
                    url
                })
            }
        }

        // 批量查询
        const mediaIds = results.filter(r => r.mediaId).map(r => r.mediaId);
        if (mediaIds.length == 0) return results;

        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const req = new BatchGetMediaInfosRequest();
                    const mediaIds = results.filter(r => !!r.mediaId).map(r => r.mediaId) as string[]
                    req.mediaIds = mediaIds.join(",");

                    const res = await this.iceClient.batchGetMediaInfos(req);


                    const infos = res.body!.mediaInfos!.map(m => {
                        const mediaBasicInfo = m.mediaBasicInfo!;
                        const fileBasicInfo = m.fileInfoList![0]!.fileBasicInfo!;

                        return {
                            duration: + fileBasicInfo?.duration! || 0,
                            mediaId: mediaBasicInfo.mediaId!,
                            height: + fileBasicInfo.height! || 0,
                            width: + fileBasicInfo.width! || 0
                        }
                    });

                    const infoMap = arrayToRecord(infos, "mediaId");

                    results.forEach(r => {
                        if (r.mediaId) {
                            const data = _.get(infoMap, r.mediaId);
                            r.data = data;
                        }
                    })
                    resolve(results);

                } catch (err) {
                    resolve(results)
                }
            }, 10 * 1000)
        })
    }

    private buildImageTrackClip(url: string, options: Timeline.VideoTrackClip = {}): Timeline.VideoTrackClip {
        return {
            MediaURL: url,
            Type: "Image",
            ...options
        }
    }

    private buildVideoTrackClip(url: string, options: Timeline.VideoTrackClip = {}): Timeline.VideoTrackClip {
        return {
            MediaURL: url,
            Type: "Video",
            ...options
        }
    }

    private buildAudioTrackClip(url: string, options: Timeline.AudioTrackClip = {}): Timeline.AudioTrackClip {
        return {
            MediaURL: url,
            LoopMode: true,
            ...options
        }
    }

    private buildGlobalImageTrackClip(url: string): Timeline.VideoTrackClip {
        return {
            MediaURL: url,
            Type: "GlobalImage",
        }
    }

    //#endregion
}

