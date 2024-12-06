export const PCA_CHINA_CODE = 100000;

import { Timeline } from "../types/ice";

export const Video_Suffix = [".mp4", ".mpeg", ".3pg", ".avi", ".mov"];
export const Image_Suffix = [".png", ".jpg", ".gif", ".jpeg"];


export const COMMON_IMAGE_SUFFIX = [
    '.jpg',
    '.jpeg',
    '.gif',
    '.bmp',
    '.png',
    '.wmf',
    '.emf',
    '.svg',
    '.tga',
    '.tif',
];

export const COMMON_VIDEO_SUFFIX = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'];

export const COMMON_AUDIO_SUFFIX = ['.mp3', '.wav', '.ogg', '.flac', '.aac'];


export const TRANSITION_LIST = [
    Timeline.SubTypeTransition.swap,
    Timeline.SubTypeTransition.windowslice,
    Timeline.SubTypeTransition.bowTieHorizontal,
    Timeline.SubTypeTransition.pinwheel,
    Timeline.SubTypeTransition.randomsquares,
    Timeline.SubTypeTransition.squareswire,
    Timeline.SubTypeTransition.circleopen,
    Timeline.SubTypeTransition.polarfunction
]