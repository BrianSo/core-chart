/**
 * Created by brian on 30/8/2017.
 */

export class Animation{

  time = 0;

  constructor(){
    this.time = 0;
  }

  onStart(time: number){

  }

  // return true to end your animation
  onUpdate(time: number):boolean|void{

  }

  //clear up and end your animation
  end(isCancel: boolean){

  }
}

export type OnAnimationUpdateCallback = (deltaTime: number, ...args: any[])=>(boolean|void);
export type OnDurationAnimationUpdateCallback = (deltaTime: number, timePast: number, progress: number, deltaProgress:number, ...args: any[])=>(void);
export interface AnimationOptions{
  onUpdate?: OnAnimationUpdateCallback;
  onStart?: Function;
  end?: Function;
}
export interface DurationAnimationOptions extends AnimationOptions{
  duration?: number;
  onUpdate?:OnDurationAnimationUpdateCallback;
}

export class SimpleAnimation extends Animation{

  lastTime = 0;
  options: AnimationOptions;

  constructor(options: AnimationOptions | OnAnimationUpdateCallback){
    super();

    if(typeof options === 'function'){
      options = {
        onUpdate:options
      };
    }

    this.options = options;
  }
  onStart(time: number){
    this.lastTime = time;
    this.options.onStart && this.options.onStart();
  }

  // return true to end your animation
  onUpdate(time: number){
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.options.onUpdate && this.options.onUpdate(deltaTime);
  }

  //clear up and end your animation
  end(isCancel: boolean){
    this.options.end && this.options.end(isCancel);
  }
}

export class DurationAnimation extends SimpleAnimation{

  duration: number;
  timePast: number;
  options: DurationAnimationOptions;

  constructor(options: DurationAnimationOptions | OnDurationAnimationUpdateCallback){
    super(options);

    this.duration = this.options.duration || 500;
    this.timePast = 0;
  }

  onUpdate(time: number){
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    this.timePast += deltaTime;
    let progress = this.timePast / this.duration;
    let deltaProgress = deltaTime/this.duration;
    let shouldEnd = false;
    if(progress > 1){
      deltaProgress = deltaProgress - progress + 1;
      progress = 1;
      shouldEnd = true;
    }
    this.options.onUpdate && this.options.onUpdate(deltaTime, this.timePast, progress, deltaProgress);
    return shouldEnd;
  }
}
