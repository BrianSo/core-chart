/**
 * Created by brian on 30/8/2017.
 */
export declare class Animation {
    time: number;
    constructor();
    onStart(time: number): void;
    onUpdate(time: number): boolean | void;
    end(isCancel: boolean): void;
}
export declare type OnAnimationUpdateCallback = (deltaTime: number, ...args: any[]) => (boolean | void);
export declare type OnDurationAnimationUpdateCallback = (deltaTime: number, timePast: number, progress: number, deltaProgress: number, ...args: any[]) => (void);
export interface AnimationOptions {
    onUpdate?: OnAnimationUpdateCallback;
    onStart?: Function;
    end?: Function;
}
export interface DurationAnimationOptions extends AnimationOptions {
    duration?: number;
    onUpdate?: OnDurationAnimationUpdateCallback;
}
export declare class SimpleAnimation extends Animation {
    lastTime: number;
    options: AnimationOptions;
    constructor(options: AnimationOptions | OnAnimationUpdateCallback);
    onStart(time: number): void;
    onUpdate(time: number): void;
    end(isCancel: boolean): void;
}
export declare class DurationAnimation extends SimpleAnimation {
    duration: number;
    timePast: number;
    options: DurationAnimationOptions;
    constructor(options: DurationAnimationOptions | OnDurationAnimationUpdateCallback);
    onUpdate(time: number): boolean;
}
