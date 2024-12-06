import { Timeline } from "../../types/ice";

export default class TimelineBuilder {

    private videoTracks: Timeline.VideoTrack[] = [];

    private audioTracks: Timeline.AudioTrack[] = [];

    private subtitleTracks: Timeline.SubtitleTrack[] = [];

    private effectTracks: Timeline.EffectTrack[] = [];

    addVideoTracks(tracks: Timeline.VideoTrack[] | Timeline.VideoTrack) {
        const items = Array.isArray(tracks) ? tracks : [tracks];
        this.videoTracks.push(...items);
    }

    addAudioTracks(tracks: Timeline.AudioTrack[] | Timeline.AudioTrack) {
        const items = Array.isArray(tracks) ? tracks : [tracks];
        this.audioTracks.push(...items);
    }

    addSubtitleTracks(tracks: Timeline.SubtitleTrack[] | Timeline.SubtitleTrack) {
        const items = Array.isArray(tracks) ? tracks : [tracks];
        this.subtitleTracks.push(...items);
    }

    addEffectTracks(tracks: Timeline.EffectTrack[] | Timeline.EffectTrack) {
        const items = Array.isArray(tracks) ? tracks : [tracks];
        this.effectTracks.push(...items);
    }


    build(): Timeline.Timeline {
        return {
            VideoTracks: this.videoTracks,
            AudioTracks: this.audioTracks,
            SubtitleTracks: this.subtitleTracks,
            EffectTracks: this.effectTracks,  
        }
    }

    reset() {
        this.videoTracks = [];
        this.audioTracks = [];
        this.subtitleTracks = [];
        this.effectTracks = [];
    }

}