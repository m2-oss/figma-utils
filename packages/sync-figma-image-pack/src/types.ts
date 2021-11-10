import { Format } from '@m2-oss/figma-utils-common';

export interface SrcFigmaImagePackConfig {
    figmaProjectID: string;
    page: string;
    frameName: string;
}

export interface DstFigmaImagePackConfig {
    folder: string;
    width?: number;
    height?: number;
    format: Format;
    color?: string;
}

export interface ImageFigmaPackConfig {
    src: SrcFigmaImagePackConfig;
    dst: DstFigmaImagePackConfig;
}
