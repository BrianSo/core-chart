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

      this.renderLine(ctx, cvx, cvy);
      this.renderMaker(ctx, cvx, cvy);
      ctx.restore();
    }

    renderLine(ctx, cvx, cvy){
      if(this.data.length){
        let start = this.d2c(this.data[0]);

        ctx.beginPath();
        ctx.lineTo(start.x, start.y);
        for(let pt of this.data){
          pt = this.d2c(pt);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        let end = this.d2c(this.data[this.data.length-1]);
        ctx.lineTo(end.x, cvy.max);
        ctx.lineTo(start.x, cvy.max);

        const gradient = ctx.createLinearGradient(0, cvy.min, 0, cvy.max);
        gradient.addColorStop(0, 'rgba(250,174,50,1)');
        gradient.addColorStop(1, 'rgba(250,174,50,0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      }
    }

    renderMaker(ctx, cvx, cvy){

      ctx.strokeStyle = '#f00';
      ctx.fillStyle = "#600";
      for(let pt of this.data){
        pt = this.d2c(pt);
        ctx.beginPath();
        ctx.lineTo(pt.x, pt.y);
        ctx.lineTo(cvx.max - 10, pt.y);

        ctx.stroke();
        ctx.closePath();

        ctx.fillRect(pt.x - 5, pt.y - 5, 10, 10);
      }
    }
  }

  class YAxis extends Axis{
    d2c(axisValue){
      let value = super.d2c(axisValue);
      return this.canvasViewPort.min + viewPortLength(this.canvasViewPort)- (value - this.canvasViewPort.min);
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

              this.chart.zoom({
                x:Math.abs(lastDistanceX/thisDistanceX),
                y:Math.abs(lastDistanceY/thisDistanceY)
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
<style>
  body{
    margin: 0;
  }
</style>
<style lang="scss" scoped>
  canvas{
    width: 100vw;
    height: 70vw;
    box-shadow: 0 0 1px #000;
  }
</style>
