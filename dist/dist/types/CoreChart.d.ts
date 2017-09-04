import EventEmitter from 'wolfy87-eventemitter';
import { Animation } from './Animation';
import { Axis } from './Axis';
import { DataPoint, DataValue, Range } from "./util";
export interface ScrollOptions {
    animated?: boolean;
    animationDuration?: number;
    cancelAnimation?: boolean;
}
export default class CoreChart {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    axises: {
        [key: string]: Axis;
    };
    data: DataPoint[];
    renderId: number;
    ee: EventEmitter;
    lastTime: number | null;
    animations: Animation[];
    constructor(canvas: HTMLCanvasElement);
    setData(data: DataPoint[]): void;
    scroll(axisDiffs: DataValue<number>, scrollLimit?: boolean, options?: ScrollOptions): void;
    scrollInPx(axisDiffs: DataValue<number>, scrollLimit?: boolean): void;
    zoom(axisDiffs: DataValue<number>, center?: DataPoint): void;
    zoomFromCanvasPx(axisDiffs: DataValue<number>, centerInCanvasPx?: DataPoint): void;
    setCanvasViewPort(axisViewPorts: DataValue<Range>): void;
    setViewPort(axisViewPorts: DataValue<Range>): void;
    setViewPortLimit(axisViewPorts: DataValue<Range>): void;
    d2c(dataInAxisValue: DataPoint): DataPoint;
    c2d(dataInCanvasValue: DataPoint): DataPoint;
    setAxis(axis: Axis): void;
    getAxis(name: string): Axis;
    removeAxis(name: string): void;
    getAllAxises(): Axis[];
    renderInNextFrame(): void;
    beforeRender(time: number, deltaTime: number): void;
    render(time: number, deltaTime: number): void;
    postRender(time: number, deltaTime: number): void;
    on(event: 'beforeRender', cb: (time: number, deltaTime: number) => void): this;
    on(event: 'render', cb: (time: number, deltaTime: number) => void): this;
    on(event: 'postRender', cb: (time: number, deltaTime: number) => void): this;
    addListener(event: string, cb: Function): this;
    once(event: string, cb: Function): this;
    addOnceListener(event: string, cb: Function): this;
    off(event: string, cb: Function): this;
    removeListener(event: string, cb: Function): this;
    startAnimation(animation: Animation): void;
    cancelAllAnimation(): void;
}
