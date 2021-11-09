export type Format = 'svg' | 'png';

export interface SrcImagePackConfig {
    figmaProjectID: string;
    page: string;
    frameName: string;
}

export interface DstImagePackConfig {
    folder: string;
    width?: number;
    height?: number;
    format: Format;
    color?: string;
}

export interface ImagePackConfig {
    src: SrcImagePackConfig;
    dst: DstImagePackConfig;
}

export interface SrcImageConfig {
    figmaProjectID: string;
    frameID: string;
    scale?: number;
    format?: Format;
}
