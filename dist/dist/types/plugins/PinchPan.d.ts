/// <reference types="hammerjs" />
import { CoreChartPlugin } from './Plugin';
import CoreChart from "../CoreChart";
export interface PinchPanManagerOptions {
    x?: string;
    y?: string;
    drag?: number;
}
export default class PinchPanManager implements CoreChartPlugin {
    name: string;
    chart: CoreChart;
    options: PinchPanManagerOptions;
    mc: HammerManager;
    constructor(options?: PinchPanManagerOptions);
    uninstall(): void;
    install(chart: CoreChart): void;
}
