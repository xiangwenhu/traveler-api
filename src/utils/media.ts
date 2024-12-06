import { COMMON_IMAGE_SUFFIX, COMMON_VIDEO_SUFFIX, COMMON_AUDIO_SUFFIX } from "../const/index";


export function isMediaType(baseTypes: string[]) {
    return function (filename: string, extraTypes: string[] = []) {
        const extList = baseTypes.concat(extraTypes);
        const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
        return extList.includes(ext);
    }
}

export const isImage = isMediaType(COMMON_IMAGE_SUFFIX);
export const isAudio = isMediaType(COMMON_AUDIO_SUFFIX);
export const isVideo = isMediaType(COMMON_VIDEO_SUFFIX);
export const isVideoOrAudio = function (filename: string, extraTypes: string[] = []) {
    return isAudio(filename, extraTypes) || isVideo(filename, extraTypes);
}