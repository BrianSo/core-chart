import EventEmitter from 'wolfy87-eventemitter';
import {Animation, DurationAnimation} from './Animation';
import {Axis, AxisName, XAxis, YAxis} from './Axis';
import {DataPoint, DataValue, Range} from "./util";

const performanceNowOrDateNow = ()=>{
  if(window.performance && window.performance.now){
    return window.performance.now();
  }
  return Date.now();
};

export type CoreChartEvent = 'beforeRender' | 'render' | 'postRender';

export interface ScrollOptions{
  animated?: boolean;
  animationDuration?: number;
  cancelAnimation?: boolean;
}

export default class CoreChart{

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  axises:{
    x: Axis,
    y: Axis
  };
  data: DataPoint[];
  private renderId: number;
  private ee: EventEmitter;
  private lastTime: number|null;
  private animations: Animation[];


  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.axises = {
      x: new XAxis(),
      y: new YAxis(),
    };
    this.data = [];
    this.renderId = -1;
    this.ee = new EventEmitter();
    this.lastTime = null;
    this.animations = [];
  }

  setData(data:DataPoint[]){
    this.data = data;
    this.invalidate();
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
          axisDiffs.x && this.axises.x.scroll(axisDiffs.x * deltaProgress, scrollLimit);
          axisDiffs.y && this.axises.y.scroll(axisDiffs.y * deltaProgress, scrollLimit);
          this.invalidate();
        }
      }));
    }else{

      axisDiffs.x && this.axises.x.scroll(axisDiffs.x, scrollLimit);
      axisDiffs.y && this.axises.y.scroll(axisDiffs.y, scrollLimit);
      this.invalidate();
    }
  }
  scrollInPx(axisDiffs:DataValue<number>, scrollLimit:boolean = false){
    axisDiffs.x && this.axises.x.scrollInPx(axisDiffs.x, scrollLimit);
    axisDiffs.y && this.axises.y.scrollInPx(axisDiffs.y, scrollLimit);
    this.invalidate();
  }
  zoom(axisDiffs:DataValue<number>, center?:DataValue<number>){
    center = center || {};
    axisDiffs.x && this.axises.x.zoom(axisDiffs.x, center.x);
    axisDiffs.y && this.axises.y.zoom(axisDiffs.y, center.y);
    this.invalidate();
  }
  zoomFromCanvasPx(axisDiffs:DataValue<number>, centerInCanvasPx?:DataValue<number>){
    centerInCanvasPx = centerInCanvasPx || {};
    axisDiffs.x && this.axises.x.zoomFromCanvasPx(axisDiffs.x, centerInCanvasPx.x);
    axisDiffs.y && this.axises.y.zoomFromCanvasPx(axisDiffs.y, centerInCanvasPx.y);
    this.invalidate();
  }

  setCanvasViewPort(axisViewPorts:DataValue<Range>){
    axisViewPorts.x && this.axises.x.setCanvasViewPort(axisViewPorts.x);
    axisViewPorts.y && this.axises.y.setCanvasViewPort(axisViewPorts.y);
    this.invalidate();
  }
  setViewPort(axisViewPorts:DataValue<Range>){
    axisViewPorts.x && this.axises.x.setViewPort(axisViewPorts.x);
    axisViewPorts.y && this.axises.y.setViewPort(axisViewPorts.y);
    this.invalidate();
  }
  setViewPortLimit(axisViewPorts:DataValue<Range>){
    axisViewPorts.x && this.axises.x.setViewPortLimit(axisViewPorts.x);
    axisViewPorts.y && this.axises.y.setViewPortLimit(axisViewPorts.y);
    this.invalidate();
  }

  d2c(dataInAxisValue:DataPoint):DataPoint{
    return {
      x: this.axises.x.d2c(dataInAxisValue.x),
      y: this.axises.y.d2c(dataInAxisValue.y),
    };
  }
  c2d(dataInCanvasValue:DataPoint):DataPoint{
    return {
      x: this.axises.x.c2d(dataInCanvasValue.x),
      y: this.axises.y.c2d(dataInCanvasValue.y),
    };
  }

  getAxis(name:AxisName):Axis{
    return this.axises[name];
  }

  invalidate(){
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
    this.axises.x.settleViewPort();
    this.axises.y.settleViewPort();
    this.ee.emit('render',time, deltaTime);
  }
  postRender(time:number, deltaTime:number){
    this.ee.emit('postRender',time, deltaTime);
  }

  on(event:'beforeRender', cb:(time: number, deltaTime: number)=>void):this;
  on(event:'render', cb:(time: number, deltaTime: number)=>void):this;
  on(event:'postRender', cb:(time: number, deltaTime: number)=>void):this;
  on(event:CoreChartEvent, cb: Function){
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
    this.invalidate();
  }
  cancelAllAnimation(){
    for(const ani of this.animations){
      ani.end(true);
    }
    this.animations = [];
  }
}
