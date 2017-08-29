import Hammer from 'hammerjs';

export default class PinchPanManager{
  constructor(canvas, chart){
    this.chart = chart;
    const mc = new Hammer.Manager(canvas);

    const pinch = new Hammer.Pinch();
    const pan = new Hammer.Pan();

    pinch.recognizeWith(pan);

    mc.add([pinch, pan]);

    let lastEv;
    let lastPointers;
    mc.on("pinch pan", (ev) => {

      ev.pointers = [...ev.pointers];
      console.log(ev);

      if(lastEv){


        this.chart.scrollInPx({
          x:-(ev.center.x - lastEv.center.x),
          y:(ev.center.y - lastEv.center.y)
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
              x:scaleX,
              y:scaleY
            }, {
              x:ev.center.x,
              y:ev.center.y
            });
          }
          lastPointers = ev.pointers;
        }

      }else{
        this.chart.scrollInPx({
          x:-ev.deltaX,
          y:ev.deltaY
        });
      }


      lastEv = ev;
    });
    mc.on("panend pinchend", (ev)=>{
      lastEv = undefined;
      lastPointers = undefined;
    });
  }
}
