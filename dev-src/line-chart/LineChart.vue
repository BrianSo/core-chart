<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
  import {CoreChart, Axis} from '../../src';
  import {viewPortLength} from '../../src/util';

  class MyChart extends CoreChart{
    render(){
      super.render();
      const ctx = this.ctx;

      ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

      let cvx = this.getAxise('x').getCanvasViewPort();
      let cvy = this.getAxise('y').getCanvasViewPort();

      ctx.strokeRect(cvx.min, cvy.min, viewPortLength(cvx), viewPortLength(cvy));

      for(let pt of this.data){
        pt = this.d2c(pt);
        ctx.fillRect(pt.x, pt.y, 10, 10);
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

    this.chart.getAxise('x').setCanvasViewPort({min: 0, max: canvas.width});
    this.chart.getAxise('y').setCanvasViewPort({min: 0, max: canvas.height});
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

      this.chart.setData([{
        x: 5,
        y: 0
      }]);
      xAxis.setViewPort({
        min: 0, max: 10
      });
      yAxis.setViewPort({
        min: 0, max: 5
      });

      this.resizeListener = onResize.bind(this);
      window.addEventListener('resize', this.resizeListener, false);
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
