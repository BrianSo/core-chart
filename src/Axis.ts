import {viewPortMove, viewPortLength, viewPortZoom, Range, DataPoint} from "./util";

export interface Ticks{
  ticks: number[],
  interval: number
}

export class Axis{

  name: string;
  viewPort: Range;
  viewPortLimit: Range;
  canvasViewPort: Range;
  shouldUpdateViewPort = false;

  constructor(name:string){
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
  }

  getCanvasViewPort():Range{
    return this.canvasViewPort;
  }
  setCanvasViewPort({min, max}:Range){
    this.canvasViewPort = {
      min, max
    };
    return this;
  }

  getScale():number{
    return viewPortLength(this.canvasViewPort) / viewPortLength(this.viewPort);
  }

  d2c(axisValue:number):number{
    if(this.shouldUpdateViewPort)
      this.settleViewPort();

    const offset = axisValue - this.viewPort.min;
    return this.canvasViewPort.min + offset * this.getScale();
  }
  c2d(canvasValue:number):number{
    if(this.shouldUpdateViewPort)
      this.settleViewPort();

    const offset = (canvasValue - this.canvasViewPort.min) / viewPortLength(this.canvasViewPort) * viewPortLength(this.viewPort);
    return offset + this.viewPort.min;
  }

  scroll(diff:number, scrollLimit:boolean = false){
    this.viewPort = viewPortMove(this.viewPort, diff);
    if(scrollLimit){
      this.viewPortLimit = viewPortMove(this.viewPortLimit, diff);
    }
    this.viewPortChanged();
  }
  scrollInPx(diff:number, scrollLimit:boolean = false){
    this.scroll(diff / viewPortLength(this.canvasViewPort) * viewPortLength(this.viewPort), scrollLimit)
  }

  zoom(scale:number, center:number){
    if(typeof center === 'undefined'){
      center = this.c2d((this.canvasViewPort.min + this.canvasViewPort.max) / 2);
    }
    this.viewPort = viewPortZoom(this.viewPort, scale, center);
    this.viewPortChanged();
  }
  zoomFromCanvasPx(scale:number, centerInCanvasPx:number){
    if(typeof centerInCanvasPx === 'undefined'){
      centerInCanvasPx = (this.canvasViewPort.min + this.canvasViewPort.max) / 2;
    }
    this.zoom(scale, this.c2d(centerInCanvasPx));
  }

  getViewPort(){
    return this.viewPort;
  }
  setViewPort({min, max}:Range){
    this.viewPort = {
      min, max
    };
    this.viewPortChanged();
    return this;
  }

  getViewPortLimit(){
    return this.viewPortLimit;
  }
  setViewPortLimit({min, max}:Range){
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
      vp = Object.assign({},vpLimit);
    } else if(vp.max > vpLimit.max){
      vp = viewPortMove(vp, vpLimit.max - vp.max);
    }else if(vp.min < vpLimit.min){
      vp = viewPortMove(vp, vpLimit.min - vp.min);
    }

    this.viewPort = vp;
  }

  ticksMax(maxNumberOfTicks:number):Ticks{

    // desiredRange will be 2 ^ n
    // viewPortLength(this.viewPort) / desiredRange <= maxNumberOfTicks

    const width = viewPortLength(this.viewPort);

    // width / 2 ^ n <= maxNumberOfTicks
    // width / maxNumberOfTicks >= 2 ^ n
    const rate = width/ maxNumberOfTicks;

    // Log_2(rate) >= n
    let n = Math.log(rate) / Math.log(2);
    n = Math.ceil(n);

    return this.ticks(Math.pow(2, n));
  }
  ticks(desiredInterval:number):Ticks{
    desiredInterval = desiredInterval || 1;

    let ticks = [];
    //find minimum tick
    // (integer division) this.viewPort / desiredInterval
    const remainder = this.viewPort.min % desiredInterval;
    let minTick = this.viewPort.min - remainder;
    if(remainder < 0)
      minTick -= desiredInterval;
    for(let t = minTick; t <= this.viewPort.max; t+= desiredInterval){
      ticks.push(t);
    }
    return {ticks, interval: desiredInterval};
  }

  /**
   * find the viewable points (starting, ending index) on this axis
   * assuming the point values are sorted on this axis
   *
   * @param points
   * @returns {{min: number, max: number}} - the starting and ending index that should be rendered
   */
  findRenderingRangeOfPoints(points:DataPoint[]){
    let {min, max} = this.viewPort;

    const resultMin = this.binaryIndexOf(points, min);
    const resultMax = this.binaryIndexOf(points, max);

    const result = {
      min: resultMin.index,
      max: resultMax.index
    };

    if(resultMin.index > 0 && min < resultMin.value){
      result.min -= 1;
    }

    if(resultMax.index < points.length - 1 && max > resultMax.value){
      result.max += 1;
    }
    return result;
  }
  findMaxMinValueOfPoints(points:DataPoint[], begin:number, end:number){
    begin = begin || 0;
    end = end || points.length-1;

    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for(let i = begin;i <= end; i++){
      const value = points[i][this.name];
      if(value > max)
        max = value;
      if(value < min)
        min = value;
    }
    return {min, max};
  }

  // private function, a binary search
  binaryIndexOf(points:DataPoint[], searchElement:number){

    let minIndex = 0;
    let maxIndex = points.length - 1;
    let currentIndex = 0;
    let currentElement = 0;

    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = points[currentIndex][this.name];

      if (currentElement < searchElement) {
        minIndex = currentIndex + 1;
      }
      else if (currentElement > searchElement) {
        maxIndex = currentIndex - 1;
      }
      else {
        break;
      }
    }
    return {index: currentIndex, value:currentElement};
  }
}

export class YAxis extends Axis{
  d2c(axisValue:number):number{
    let value = super.d2c(axisValue);
    return this.canvasViewPort.min + this.canvasViewPort.max - value;
  }
  c2d(canvasValue:number):number{
    let value = this.canvasViewPort.min + this.canvasViewPort.max - canvasValue;
    return super.c2d(value);
  }
}
export default Axis;
