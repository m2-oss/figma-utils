export type Format = 'svg'| 'png';

export interface SrcSchemaConfig {
  figmaProjectID: string;
  page: string;
  frameName: string;
}

export interface SrcImageConfig {
  figmaProjectID:string;
  frameID:string;
  scale?: number;
  format?:Format;
}