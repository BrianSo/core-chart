import {viewPortMove, viewPortLength, viewPortZoom} from "./util";

export default class Axis{
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

  d2c(axisValue){
    if(this.shouldUpdateViewPort)
      this.settleViewPort();

    const offset = axisValue - this.viewPort.min;
    return this.canvasViewPort.min + offset * viewPortLength(this.canvasViewPort) / viewPortLength(this.viewPort);
  }
  c2d(canvasValue){
    if(this.shouldUpdateViewPort)
      this.settleViewPort();

    const offset = (canvasValue - this.canvasViewPort.min) / viewPortLength(this.canvasViewPort) * viewPortLength(this.viewPort);
    return offset + this.viewPort.min;
  }

  scroll(diff){
    this.viewPort = viewPortMove(this.viewPort, diff);
    this.viewPortChanged();
  }
  scrollInPx(diff){
    this.scroll(diff / viewPortLength(this.canvasViewPort) * viewPortLength(this.viewPort))
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
}
