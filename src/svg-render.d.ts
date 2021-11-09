declare module 'svg-render' {
    export interface Options {
        buffer: Buffer;
        width?: number;
        height?: number;
        expandUseTags?: boolean;
    }
    export default function svgToPng(options: Options): Buffer;
}
