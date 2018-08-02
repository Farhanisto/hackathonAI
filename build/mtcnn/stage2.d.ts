import { BoundingBox } from '../BoundingBox';
import { RNetParams } from './types';
export declare function stage2(img: HTMLCanvasElement, inputBoxes: BoundingBox[], scoreThreshold: number, params: RNetParams, stats: any): Promise<{
    boxes: BoundingBox[];
    scores: number[];
}>;
