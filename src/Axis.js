import {viewPortMove, viewPortLength, viewPortZoom} from "./util";

export class Axis{
  constructor(name){
    this.name = name;
    this.viewPort = {
      min: 0,
      max: 1,
    };
    this.viewPortLimit = {
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY,
    };
    this.canvasViewPort = {
      min: 0,
      max: 1
    };

    this.shouldUpdateViewPort = false;
  }

  getCanvasViewPort(){
    return this.canvasViewPort;
  }
  setCanvasViewPort({min, max}){
    this.canvasViewPort = {
      min, max
    };
    return this;
  }

  getScale(){
    return viewPortLength(this.canvasViewPort) / viewPortLength(this.viewPort);
  }

  d2c(axisValue){
    if(this.shouldUpdateViewPort)
      this.settleViewPort();

    const offset = axisValue - this.viewPort.min;
    return this.canvasViewPort.min + offset * this.getScale();
  }
  c2d(canvasValue){
    if(this.shouldUpdateViewPort)
      this.settleViewPort();

    const offset = (canvasValue - this.canvasViewPort.min) / viewPortLength(this.canvasViewPort) * viewPortLength(this.viewPort);
    return offset + this.viewPort.min;
  }

  scroll(diff, scrollLimit){
    this.viewPort = viewPortMove(this.viewPort, diff);
    if(scrollLimit){
      this.viewPortLimit = viewPortMove(this.viewPortLimit, diff);
    }
    this.viewPortChanged();
  }
  scrollInPx(diff, scrollLimit){
    this.scroll(diff / viewPortLength(this.canvasViewPort) * viewPortLength(this.viewPort), scrollLimit)
  }

  zoom(scale, center){
    if(typeof center === 'undefined'){
      center = this.c2d((this.canvasViewPort.min + this.canvasViewPort.max) / 2);
    }
    this.viewPort = viewPortZoom(this.viewPort, scale, center);
    this.viewPortChanged();
  }
  zoomFromCanvasPx(scale, centerInCanvasPx){
    if(typeof centerInCanvasPx === 'undefined'){
      centerInCanvasPx = (this.canvasViewPort.min + this.canvasViewPort.max) / 2;
    }
    this.zoom(scale, this.c2d(centerInCanvasPx));
  }

  getViewPort(){
    return this.viewPort;
  }
  setViewPort({min, max}){
    this.viewPort = {
      min, max
    };
    this.viewPortChanged();
    return this;
  }

  getViewPortLimit(){
    return this.viewPortLimit;
  }
  setViewPortLimit({min, max}){
    this.viewPortLimit = {min, max};
    this.viewPortChanged();
    return this;
  }

  viewPortChanged(){
    this.shouldUpdateViewPort = true;
  }
  settleViewPort(){
    this.shouldUpdateViewPort = false;

    let vp = this.viewPort;
    const vpLimit = this.viewPortLimit;

    if(viewPortLength(vp) >= viewPortLength(vpLimit)){
      vp = {...vpLimit};
    } else if(vp.max > vpLimit.max){
      vp = viewPortMove(vp, vpLimit.max - vp.max);
    }else if(vp.min < vpLimit.min){
      vp = viewPortMove(vp, vpLimit.min - vp.min);
    }

    this.viewPort = vp;
  }

  ticksMax(maxNumberOfTicks){

    // desiredRange will be 2 ^ n
    // viewPortLength(this.viewPort) / desiredRange <= maxNumberOfTicks

    const width = viewPortLength(this.viewPort);

    // width / 2 ^ n <= maxNumberOfTicks
    // width / maxNumberOfTicks >= 2 ^ n
    const rate = width/ maxNumberOfTicks;

    // Log_2(rate) >= n
    let n = Math.log2(rate);
    n = Math.ceil(n);

    return this.ticks(Math.pow(2, n));
  }
  ticks(desiredRange){
    desiredRange = desiredRange || 1;

    let ticksPos = [];
    //find minimum tick
    const minTick = this.viewPort.min - Math.abs(this.viewPort.min % desiredRange);
    for(let t = minTick; t <= this.viewPort.max; t+= desiredRange){
      ticksPos.push(t);
    }
    return ticksPos;
  }
}

export class YAxis extends Axis{
  d2c(axisValue){
    let value = super.d2c(axisValue);
    return viewPortLength(this.canvasViewPort) - value;
  }
  c2d(canvasValue){
    let value = viewPortLength(this.canvasViewPort) - canvasValue;
    return super.c2d(value);
  }
}
export default Axis;
