<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
  import PinchPanManager from './PinchPan';
  import {CoreChart, Axis, YAxis} from '../../src';
  import {viewPortLength} from '../../src/util';

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
        min: 0, max: 10
      });

      // Events
      this.resizeListener = onResize.bind(this);
      window.addEventListener('resize', this.resizeListener, false);

      new PinchPanManager(this.$refs.canvas, this.chart);
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
