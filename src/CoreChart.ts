import EventEmitter from 'wolfy87-eventemitter';
import {Animation, DurationAnimation} from './Animation';
import {Axis} from './Axis';
import {DataPoint, DataValue, Range} from "./util";

const performanceNowOrDateNow = ()=>{
  if(window.performance && window.performance.now){
    return window.performance.now();
  }
  return Date.now();
};

export interface ScrollOptions{
  animated?: boolean;
  animationDuration?: number;
  cancelAnimation?: boolean;
}

export default class CoreChart{

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  axises:{
    [key: string]: Axis
  };
  data: DataPoint[];
  renderId: number;
  ee: EventEmitter;
  lastTime: number|null;
  animations: Animation[];
  private disposed: boolean = false;


  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.axises = {};
    this.data = [];
    this.renderId = -1;
    this.ee = new EventEmitter();
    this.lastTime = null;
    this.animations = [];
  }

  setData(data:DataPoint[]){
    this.data = data;
    this.renderInNextFrame();
  }

  scroll(axisDiffs:DataValue<number>, scrollLimit:boolean = false, options: ScrollOptions = {}){
    options = Object.assign({
      animated: false,
      animationDuration: 300,
      cancelAnimation: false
    },options);

    if(options.cancelAnimation) {
      this.cancelAllAnimation();
    }

    if(options.animated){
      this.startAnimation(new DurationAnimation({
        duration: options.animationDuration,
        onUpdate:(deltaTime, time, progress, deltaProgress)=>{
          for(const key of Object.keys(axisDiffs)){
            this.axises[key] && this.axises[key].scroll(axisDiffs[key] * deltaProgress, scrollLimit);
          }
          this.renderInNextFrame();
        }
      }));
    }else{

      for(const key of Object.keys(axisDiffs)){
        this.axises[key] && this.axises[key].scroll(axisDiffs[key], scrollLimit);
      }
      this.renderInNextFrame();
    }
  }
  scrollInPx(axisDiffs:DataValue<number>, scrollLimit:boolean = false){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].scrollInPx(axisDiffs[key], scrollLimit);
    }
    this.renderInNextFrame();
  }
  zoom(axisDiffs:DataValue<number>, center?:DataPoint){
    center = center || {};
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].zoom(axisDiffs[key], center[key]);
    }
    this.renderInNextFrame();
  }
  zoomFromCanvasPx(axisDiffs:DataValue<number>, centerInCanvasPx?:DataPoint){
    centerInCanvasPx = centerInCanvasPx || {};
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].zoomFromCanvasPx(axisDiffs[key], centerInCanvasPx[key]);
    }
    this.renderInNextFrame();
  }

  setCanvasViewPort(axisViewPorts:DataValue<Range>){
    for(const key of Object.keys(axisViewPorts)){
      this.axises[key] && this.axises[key].setCanvasViewPort(axisViewPorts[key]);
    }
    this.renderInNextFrame();
  }
  setViewPort(axisViewPorts:DataValue<Range>){
    for(const key of Object.keys(axisViewPorts)){
      this.axises[key] && this.axises[key].setViewPort(axisViewPorts[key]);
    }
    this.renderInNextFrame();
  }
  setViewPortLimit(axisViewPorts:DataValue<Range>){
    for(const key of Object.keys(axisViewPorts)){
      this.axises[key] && this.axises[key].setViewPortLimit(axisViewPorts[key]);
    }
    this.renderInNextFrame();
  }

  d2c(dataInAxisValue:DataPoint):DataPoint{
    const result:DataPoint = {};
    for(const key of Object.keys(dataInAxisValue)){
      if(this.axises[key])
        result[key] = this.axises[key].d2c(dataInAxisValue[key]);
    }
    return result;
  }
  c2d(dataInCanvasValue:DataPoint):DataPoint{
    const result:DataPoint = {};
    for(const key of Object.keys(dataInCanvasValue)){
      if(this.axises[key])
        result[key] = this.axises[key].c2d(dataInCanvasValue[key]);
    }
    return result;
  }

  setAxis(axis:Axis) {
    this.axises[axis.name] = axis;
  }

  getAxis(name:string):Axis{
    return this.axises[name];
  }
  removeAxis(name:string){
    delete this.axises[name];
  }

  getAllAxises():Axis[]{
    return Object.keys(this.axises).map(name=>this.axises[name]);
  }

  renderInNextFrame(){
    if(this.disposed){
      console.warn('Calling renderInNextFrame after disposing');
      return;
    }
    if(this.renderId === -1){
      this.renderId = requestAnimationFrame((rafTime)=>{
        const time = performanceNowOrDateNow();
        this.renderId = -1;

        if(this.lastTime === null)
          this.lastTime = time;
        const deltaTime = (time - this.lastTime)/1000;
        this.lastTime = time;

        this.beforeRender(time, deltaTime);
        this.render(time, deltaTime);
        this.postRender(time, deltaTime);
      });
    }
  }

  dispose(){
    this.cancelRender();
    this.disposed = true;
  }

  cancelRender(){
    cancelAnimationFrame(this.renderId);
    this.renderId = -1;
  }

  beforeRender(time:number, deltaTime:number){
    this.ee.emit('beforeRender',time, deltaTime);

    for(let i = this.animations.length - 1; i >= 0; i--){
      if(this.animations[i].onUpdate(time) === true){
        this.animations[i].end(false);
        this.animations.splice(i, 1);
      }
    }
  }

  render(time:number, deltaTime:number){
    this.getAllAxises().forEach(axis=>{
      axis.settleViewPort();
    });
    this.ee.emit('render',time, deltaTime);
  }
  postRender(time:number, deltaTime:number){
    this.ee.emit('postRender',time, deltaTime);
  }


  on(event:'beforeRender', cb:(time: number, deltaTime: number)=>void):this;
  on(event:'render', cb:(time: number, deltaTime: number)=>void):this;
  on(event:'postRender', cb:(time: number, deltaTime: number)=>void):this;
  on(event:string, cb: Function){
    this.ee.addListener(event, cb);
    return this;
  }

  addListener(event:string, cb:Function){
    this.ee.addListener(event, cb);
    return this;
  }
  once(event:string, cb:Function){
    this.ee.addOnceListener(event, cb);
    return this;
  }
  addOnceListener(event:string, cb:Function){
    this.ee.addOnceListener(event, cb);
    return this;
  }
  off(event:string, cb:Function){
    this.ee.removeListener(event, cb);
    return this;
  }
  removeListener(event:string, cb:Function){
    this.ee.removeListener(event, cb);
    return this;
  }

  startAnimation(animation:Animation){
    this.animations.push(animation);
    animation.onStart(performanceNowOrDateNow());
    this.renderInNextFrame();
  }
  cancelAllAnimation(){
    for(const ani of this.animations){
      ani.end(true);
    }
    this.animations = [];
  }
}
