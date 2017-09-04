export interface DataValue<T> {
    [key: string]: T;
}
export declare type DataPoint = DataValue<number>;
export interface Range {
    min: number;
    max: number;
}
export declare const viewPortMove: ({min, max}: Range, amount: number) => Range;
export declare const viewPortZoom: ({min, max}: Range, scale: number, mid: number) => Range;
export declare const viewPortLength: ({min, max}: Range) => number;
