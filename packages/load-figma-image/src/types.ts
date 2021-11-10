import { Format } from '@m2-oss/figma-utils-common';

export interface SrcImageConfig {
    figmaProjectID: string;
    frameID: string;
    scale?: number;
    format?: Format;
}
