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
    return canvasValue;
  }

  scroll(diff){
    this.viewPort = viewPortMove(this.viewPort, diff);
    this.viewPortChanged();
  }

  zoom(scale){
    this.viewPort = viewPortZoom(this.viewPort, scale);
    this.viewPortChanged();
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

  getVuewOirtLimit(){
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
  }
}
