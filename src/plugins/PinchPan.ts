import * as Hammer from 'hammerjs';
import CoreChart, {CoreChartPlugin} from "../CoreChart";

export interface PinchPanManagerOptions{
  drag?: number
}

export default class PinchPanManager implements CoreChartPlugin{

  name = 'PinchPanManager';
  chart: CoreChart;
  options: PinchPanManagerOptions;

  constructor(options: PinchPanManagerOptions = {}){
    this.options = Object.assign({
      drag: 2,
    },options);
  }

  install(chart: CoreChart): void {
    this.chart = chart;

    const mc = new Hammer.Manager(chart.canvas);

    const pinch = new Hammer.Pinch();
    const pan = new Hammer.Pan();

    pinch.recognizeWith(pan);

    mc.add([pinch, pan]);

    let lastEvent: HammerInput|undefined;
    let lastPointers: any[]|undefined;

    // the function callback for the decay velocity update
    let lastUpdateCb: Function|undefined;

    mc.on("pinch pan", (ev) => {

      // if is decaying
      if(lastUpdateCb) {
        // stop the decay
        chart.off('beforeRender', lastUpdateCb);
        lastUpdateCb = undefined;
      }

      //ev.pointers = [...ev.pointers];
      //console.log(ev);

      if(!lastEvent){
        // just finger down

        this.chart.scrollInPx({
          x:-ev.deltaX,
          y:ev.deltaY
        });

      }else{
        // scroll by the distance between last frame

        this.chart.scrollInPx({
          x:-(ev.center.x - lastEvent.center.x),
          y:(ev.center.y - lastEvent.center.y)
        });

        if(ev.pointers.length > 1){
          // pinch
          if(lastPointers){
            // the finger distance of this frame
            const thisDistanceX = ev.pointers[0].clientX - ev.pointers[1].clientX;
            const thisDistanceY = ev.pointers[0].clientY - ev.pointers[1].clientY;

            // the finger distance of last frame
            const lastDistanceX = lastPointers[0].clientX - lastPointers[1].clientX;
            const lastDistanceY = lastPointers[0].clientY - lastPointers[1].clientY;

            const scaleX = Math.abs(thisDistanceX) < 100 ? 1 : Math.abs(lastDistanceX/thisDistanceX);
            const scaleY = Math.abs(thisDistanceY) < 100 ? 1 : Math.abs(lastDistanceY/thisDistanceY);
            this.chart.zoomFromCanvasPx({
              x:scaleX,
              y:scaleY
            }, {
              x:ev.center.x,
              y:ev.center.y
            });
          }
          lastPointers = ev.pointers;
        }
      }

      lastEvent = ev;
    });

    // ending event
    mc.on("panend pinchend", (ev)=>{

      // normally the browser frame update uses 16ms.
      // we can't find the time used in this frame update, so we just put the average value 16 here.
      const timeUsed = 16;
      let lastVelocity = lastEvent!.velocityX * timeUsed;

      if(Math.abs(lastVelocity) > 3){

        const velocityUpdate = (time: number, deltaTime: number)=>{

          // if decay finish
          if(Math.abs(lastVelocity) < 1){
            chart.off('beforeRender', velocityUpdate);
          }

          // update velocity
          if(deltaTime > 0){
            let decrease = this.options.drag! * deltaTime;
            if(decrease > 1)
              decrease = 1;
            lastVelocity *= 1 - decrease;
          }

          // scroll
          chart.scrollInPx({x:-lastVelocity});
        };

        chart.on('beforeRender', velocityUpdate);
        lastUpdateCb = velocityUpdate;
      }

      lastEvent = undefined;
      lastPointers = undefined;
    });
  }
}
