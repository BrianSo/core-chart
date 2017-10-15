import CoreChart from "../CoreChart";
export interface CoreChartPlugin {
    name: string;
    /**
     * Install the plugin
     * e.g. add event listener to render event
     */
    install(chart: CoreChart): void;
    /**
     * uninstall the plugin
     * e.g. remove the event listeners
     */
    uninstall(): void;
}
