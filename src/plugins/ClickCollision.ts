import * as Hammer from 'hammerjs';
import {DataPoint} from "../util";
import {CoreChart} from "../index";
import {CoreChartPlugin} from "../CoreChart";

export interface ClickableArea{
  isClicked(canvasPosition: DataPoint):boolean;
  data: any;
}

export class Circle implements ClickableArea{
  center: DataPoint;
  radius: number;
  data: any;

  isClicked(canvasPosition: DataPoint): boolean {
    let xDiff = this.center.x - canvasPosition.x;
    let yDiff = this.center.y - canvasPosition.y;
    let distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    return distance <= this.radius;
  }
}


export class Rect implements ClickableArea{
  point1: DataPoint;
  point2: DataPoint;
  data: any;

  isClicked(canvasPosition: DataPoint): boolean {
    return canvasPosition.x >= this.point1.x && canvasPosition.x <= this.point2.x
      && canvasPosition.y >= this.point1.y && canvasPosition.y <= this.point2.y;
  }
}

export type CircleFunction = (center: DataPoint, radius: number, data?: any)=>void;
export type RectFunction = (point1: DataPoint, potin2: DataPoint, data?: any)=>void;

export interface ClickManagerOptions{
  createClickableArea?(circle: CircleFunction, rect: RectFunction):void
  onClick?(data: any): void
}

export default class ClickManager implements CoreChartPlugin{
  name: string = 'ClickManager';

  options: ClickManagerOptions;
  chart: CoreChart;

  areaLength: number;
  areas: ClickableArea[];
  circlePool: Circle[];
  rectPool: Rect[];

  constructor(options: ClickManagerOptions = {}){
    this.options = Object.assign({

      // default one
      createClickableArea:(circle: CircleFunction, rect: RectFunction)=>{
        for(let pt of this.chart.data){
          const canvasPoint = this.chart.d2c(pt);
          circle(canvasPoint, 10, pt);
        }
      },
    },options);

    this.areaLength = 0;
    this.areas = [];
    this.circlePool = [];
    this.rectPool = [];
  }

  install(chart: CoreChart): void {
    this.chart = chart;

    const mc = new Hammer.Manager(chart.canvas);
    const tap = new Hammer.Tap();
    mc.add(tap);

    mc.on('tap', (event)=>{
      if(this.options.onClick){
        let data = this.getClicked(event.center);
        if(data)
          this.options.onClick(data);
      }
    });

    this.chart.on('postRender', ()=>{

      //
      // Add Circle and Rect to this.areas
      //
      // The implementation might not be so readable
      // It avoid object allocation to reduce Garbage Collection times
      // reuse the old circle, rect from the pool.

      let circleIndex = 0;
      let rectIndex = 0;
      this.areaLength = 0;

      this.options.createClickableArea!((center: DataPoint, radius: number, data?: any)=>{
        this.areas.push(new Circle());
        let circle = circleIndex < this.circlePool.length ? this.circlePool[circleIndex] : new Circle();
        circle.center = center;
        circle.radius = radius;
        circle.data = data;

        if(this.areaLength >= this.areas.length){
          this.areas.push(circle);
        }else{
          this.areas[this.areaLength] = circle;
        }
        this.areaLength++;
      },
      (point1: DataPoint, point2: DataPoint, data?: any)=>{
        this.areas.push(new Rect());
        let rect = rectIndex < this.rectPool.length ? this.rectPool[rectIndex] : new Rect();
        rect.point1 = point1;
        rect.point2 = point2;
        rect.data = data;

        if(this.areaLength >= this.areas.length){
          this.areas.push(rect);
        }else{
          this.areas[this.areaLength] = rect;
        }
        this.areaLength++;
      });
    });
  }

  getClicked(canvasPosition: DataPoint): any | null{
    for(let i = 0; i < this.areaLength; i++){
      if(this.areas[i].isClicked(canvasPosition)){
        return this.areas[i].data;
      }
    }
    return null;
  }
}
