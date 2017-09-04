import CoreChart from "../CoreChart";
export interface PinchPanManagerOptions {
    x?: string;
    y?: string;
    drag?: number;
}
export default class PinchPanManager {
    chart: CoreChart;
    constructor(canvas: HTMLCanvasElement, chart: CoreChart, options?: PinchPanManagerOptions);
}
