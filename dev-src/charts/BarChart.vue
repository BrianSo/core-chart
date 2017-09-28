<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
  import PinchPanManager from '../../src/plugins/PinchPan';
  import {CoreChart, Axis, YAxis} from '../../src';
  import {BarChartRenderer} from './BarChart-renderer';

  function updateSize(){
    const canvas = this.$refs.canvas;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    this.chart.getAxis('x').setCanvasViewPort({min: 10, max: canvas.width-10});
    this.chart.getAxis('y').setCanvasViewPort({min: 10, max: canvas.height-10});
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
      this.chart = new CoreChart(this.$refs.canvas);
      let renderer = new BarChartRenderer(this.chart);
      this.chart.on('render', (time, deltaTime)=>renderer.render(time, deltaTime));

      const xAxis = new Axis('x');
      const yAxis = new YAxis('y');
      this.chart.setAxis(xAxis);
      this.chart.setAxis(yAxis);

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
