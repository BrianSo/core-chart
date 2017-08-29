import Hammer from 'hammerjs';

export default class PinchPanManager{
  constructor(canvas, chart, options){
    options = options || {
      x: 'x',
      y: 'y',
    };
    this.chart = chart;
    const mc = new Hammer.Manager(canvas);

    const pinch = new Hammer.Pinch();
    const pan = new Hammer.Pan();

    pinch.recognizeWith(pan);

    mc.add([pinch, pan]);

    let lastEv;
    let lastPointers;
    let lastTween;
    let lastUpdateCb;

    mc.on("pinch pan", (ev) => {

      if(lastUpdateCb) {
        chart.off('beforeRender', lastUpdateCb);
        lastUpdateCb = undefined;
      }

      ev.pointers = [...ev.pointers];
      //console.log(ev);

      if(lastEv){


        this.chart.scrollInPx({
          [options.x]:-(ev.center.x - lastEv.center.x),
          [options.y]:(ev.center.y - lastEv.center.y)
        });

        if(ev.pointers.length > 1){
          //pinch
          if(lastPointers){
            const thisDistanceX = ev.pointers[0].clientX - ev.pointers[1].clientX;
            const lastDistanceX = lastPointers[0].clientX - lastPointers[1].clientX;

            const thisDistanceY = ev.pointers[0].clientY - ev.pointers[1].clientY;
            const lastDistanceY = lastPointers[0].clientY - lastPointers[1].clientY;

            const scaleX = Math.abs(thisDistanceX) < 100 ? 1 : Math.abs(lastDistanceX/thisDistanceX);
            const scaleY = Math.abs(thisDistanceY) < 100 ? 1 : Math.abs(lastDistanceY/thisDistanceY);
            this.chart.zoomFromCanvasPx({
              [options.x]:scaleX,
              [options.y]:scaleY
            }, {
              [options.x]:ev.center.x,
              [options.y]:ev.center.y
            });
          }
          lastPointers = ev.pointers;
        }

      }else{
        this.chart.scrollInPx({
          [options.x]:-ev.deltaX,
          [options.y]:ev.deltaY
        });
      }


      lastEv = ev;
    });
    mc.on("panend pinchend", (ev)=>{
      const lastEvInScope = lastEv;
      lastEv = undefined;
      lastPointers = undefined;

      if(Math.abs(lastEvInScope.velocityX * 16) > 3){
        let lastVelocity = lastEvInScope.velocityX * 16;
        console.log(lastVelocity);
        const velocityUpdate = (time, deltaTime)=>{
          if(Math.abs(lastVelocity) < 1){
            chart.off('beforeRender', velocityUpdate);
          }

          if(deltaTime > 0){
            lastVelocity *= 1 - 2 * deltaTime;
          }
          chart.scrollInPx({x:-lastVelocity});
        };
        chart.on('beforeRender', velocityUpdate);
        lastUpdateCb = velocityUpdate;
      }
    });
  }
}
