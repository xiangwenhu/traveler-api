import { Timeline } from "../../types/ice";

export interface VideoTrackOptions {
    imageDuration: number;
    mainTrack?: boolean;
    useTransition?: boolean;
    transitionList?: Timeline.SubTypeTransition[];
    transitionDuration?: number;
}

export interface VideoMediaInfo {
    url: string;
    mediaId?: string;
    data?: {
        duration?: number;
        height?: number;
        width?: number;
    }
}


export type AudioTrackOptions = Pick<Timeline.AudioTrackClip, "LoopMode">