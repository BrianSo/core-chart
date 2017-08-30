/**
 * Created by brian on 30/8/2017.
 */

export class Animation{
  constructor(){
    this.time = 0;
  }

  onStart(time){

  }

  // return true to end your animation
  onUpdate(time){

  }

  //clear up and end your animation
  end(isCancel){

  }
}

export class SimpleAnimation extends Animation{
  constructor(options){
    super();

    if(typeof options === 'function'){
      options = {
        onUpdate:options
      };
    }

    this.lastTime = 0;
    this.options = options;
  }
  onStart(time){
    this.lastTime = time;
    this.options.onStart && this.options.onStart();
  }

  // return true to end your animation
  onUpdate(time){
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.options.onUpdate && this.options.onUpdate(deltaTime);
  }

  //clear up and end your animation
  end(isCancel){
    this.options.end && this.options.end(isCancel);
  }
}

export class DurationAnimation extends SimpleAnimation{
  constructor(options){
    super(options);

    this.duration = this.options.duration || 500;
    this.timePast = 0;
  }

  onUpdate(time){
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
export default Animation;
