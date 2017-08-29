<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
  import {CoreChart, Axis} from '../../src';
  import {viewPortLength} from '../../src/util';
  import Hammer from 'hammerjs';

  class MyChart extends CoreChart{
    render(){
      super.render();
      const ctx = this.ctx;

      ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

      ctx.save();
      let cvx = this.getAxise('x').getCanvasViewPort();
      let cvy = this.getAxise('y').getCanvasViewPort();

      ctx.beginPath();
      ctx.rect(cvx.min, cvy.min, viewPortLength(cvx), viewPortLength(cvy));
      ctx.stroke();
      ctx.clip();
      ctx.closePath();

      this.renderBar(ctx, cvx, cvy);
      ctx.restore();
    }

    renderBar(ctx, cvx, cvy){

      ctx.strokeStyle = '#f00';
      ctx.fillStyle = "#600";

      const xScale = this.getAxise('x').getScale();
      for(let pt of this.data){
        pt = this.d2c(pt);

        const width = 1 * xScale;
        const height = cvy.max - pt.y;

        ctx.fillRect(pt.x - width/2, pt.y, width, height);
      }
    }
  }

  class YAxis extends Axis{
    d2c(axisValue){
      let value = super.d2c(axisValue);
      return viewPortLength(this.canvasViewPort) - value;
    }
    c2d(canvasValue){
      let value = viewPortLength(this.canvasViewPort) - canvasValue;
      return super.c2d(value);
    }
  }


  function updateSize(){
    const canvas = this.$refs.canvas;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    this.chart.getAxise('x').setCanvasViewPort({min: 10, max: canvas.width-10});
    this.chart.getAxise('y').setCanvasViewPort({min: 10, max: canvas.height-10});
  }

  function onResize(){
    updateSize.call(this);
    this.chart.render();
  }

  export default {
    data() {
      return {
        chart: null,
        resizeListener: null
      }
    },
    computed: {},
    mounted() {
      this.chart = new MyChart(this.$refs.canvas);
      const xAxis = new Axis('x');
      const yAxis = new YAxis('y');
      this.chart.setAxise(xAxis);
      this.chart.setAxise(yAxis);

      updateSize.call(this);

      this.chart.setData([
        {x: 3, y: 2},
        {x: 5, y: 4},
        {x: 7, y: 8},
        {x: 9, y: 3},
        {x: 10, y: 6}
      ]);
      xAxis.setViewPort({
        min: 3, max: 10
      });
      yAxis.setViewPort({
        min: 1, max: 9
      });
      xAxis.setViewPortLimit({
        min: 1, max: 12
      });
      yAxis.setViewPortLimit({
        min: 0, max: 20
      });

      // Events
      this.resizeListener = onResize.bind(this);
      window.addEventListener('resize', this.resizeListener, false);

      const mc = new Hammer.Manager(this.$refs.canvas);

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
    },
    beforeDestroy(){
      this.resizeListener && window.removeEventListener('resize', this.resizeListener);
    },
    methods: {},
    props: {},
    components: {}
  }
</script>
<style lang="scss" scoped>
  canvas{
    width: 100vw;
    height: 70vw;
    box-shadow: 0 0 1px #000;
  }
</style>
