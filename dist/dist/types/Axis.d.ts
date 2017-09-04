import { Range, DataPoint } from "./util";
export interface Ticks {
    ticks: number[];
    interval: number;
}
export declare class Axis {
    name: string;
    viewPort: Range;
    viewPortLimit: Range;
    canvasViewPort: Range;
    shouldUpdateViewPort: boolean;
    constructor(name: string);
    getCanvasViewPort(): Range;
    setCanvasViewPort({min, max}: Range): this;
    getScale(): number;
    d2c(axisValue: number): number;
    c2d(canvasValue: number): number;
    scroll(diff: number, scrollLimit?: boolean): void;
    scrollInPx(diff: number, scrollLimit?: boolean): void;
    zoom(scale: number, center?: number): void;
    zoomFromCanvasPx(scale: number, centerInCanvasPx?: number): void;
    getViewPort(): Range;
    setViewPort({min, max}: Range): this;
    getViewPortLimit(): Range;
    setViewPortLimit({min, max}: Range): this;
    viewPortChanged(): void;
    settleViewPort(): void;
    ticksMax(maxNumberOfTicks: number): Ticks;
    ticks(desiredInterval?: number): Ticks;
    /**
     * find the viewable points (starting, ending index) on this axis
     * assuming the point values are sorted on this axis
     *
     * @param points
     * @returns {{min: number, max: number}} - the starting and ending index that should be rendered
     */
    findRenderingRangeOfPoints(points: DataPoint[]): {
        min: number;
        max: number;
    };
    findMaxMinValueOfPoints(points: DataPoint[], begin?: number, end?: number): {
        min: number;
        max: number;
    };
    binaryIndexOf(points: DataPoint[], searchElement: number): {
        index: number;
        value: number;
    };
}
export declare class YAxis extends Axis {
    d2c(axisValue: number): number;
    c2d(canvasValue: number): number;
}
export default Axis;
