import EventEmitter from 'wolfy87-eventemitter';
import {Animation, DurationAnimation} from './Animation';

const performanceNowOrDateNow = ()=>{
  if(window.performance && window.performance.now){
    return window.performance.now();
  }
  return Date.now();
};

export default class CoreChart{
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.axises = {};
    this.data = [];
    this.renderId = -1;
    this.ee = new EventEmitter();
    this.lastTime = null;
    this.animations = [];
  }

  setData(data){
    this.data = data;
    this.renderInNextFrame();
  }

  scroll(axisDiffs, scrollLimit, options){
    options = options || {};
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
  scrollInPx(axisDiffs, scrollLimit){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].scrollInPx(axisDiffs[key], scrollLimit);
    }
    this.renderInNextFrame();
  }
  zoom(axisDiffs, center){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].zoom(axisDiffs[key], center[key]);
    }
    this.renderInNextFrame();
  }
  zoomFromCanvasPx(axisDiffs, centerInCanvasPx){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].zoomFromCanvasPx(axisDiffs[key], centerInCanvasPx[key]);
    }
    this.renderInNextFrame();
  }
  setViewPort(axisViewPorts){
    for(const key of Object.keys(axisViewPorts)){
      this.axises[key] && this.axises[key].setViewPort(axisViewPorts[key]);
    }
    this.renderInNextFrame();
  }

  d2c(dataInAxisValue){
    const result = {};
    for(const key of Object.keys(dataInAxisValue)){
      if(this.axises[key])
        result[key] = this.axises[key].d2c(dataInAxisValue[key]);
    }
    return result;
  }
  c2d(dataInCanvasValue){
    const result = {};
    for(const key of Object.keys(dataInCanvasValue)){
      if(this.axises[key])
        result[key] = this.axises[key].c2d(dataInCanvasValue[key]);
    }
    return result;
  }

  setAxise(axis) {
    this.axises[axis.name] = axis;
  }

  getAxise(name){
    return this.axises[name];
  }
  removeAxise(name){
    delete this.axises[name];
  }

  getAllAxise(){
    return Object.keys(this.axises).map(name=>this.axises[name]);
  }

  renderInNextFrame(){
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

  beforeRender(time, deltaTime){
    this.ee.emit('beforeRender',time, deltaTime);

    for(let i = this.animations.length - 1; i >= 0; i--){
      if(this.animations[i].onUpdate(time) === true){
        this.animations[i].end(false);
        this.animations.splice(i, 1);
      }
    }
  }

  render(time, deltaTime){
    this.getAllAxise().forEach(axis=>{
      axis.settleViewPort();
    });
    this.ee.emit('render',time, deltaTime);
  }
  postRender(time, deltaTime){
    this.ee.emit('postRender',time, deltaTime);
  }


  on(event, cb){
    return this.ee.addListener(event, cb);
  }
  addListener(event, cb){
    return this.ee.addListener(event, cb);
  }
  once(event, cb){
    return this.ee.addOnceListener(event, cb);
  }
  addOnceListener(event, cb){
    return this.ee.addOnceListener(event, cb);
  }
  off(event, cb){
    return this.ee.removeListener(event, cb);
  }
  removeListener(event, cb){
    return this.ee.removeListener(event, cb);
  }

  startAnimation(animation){
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
