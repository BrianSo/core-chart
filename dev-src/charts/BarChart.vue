<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
  import PinchPanManager from '../../src/plugins/PinchPan';
  import {CoreChart, Axis, YAxis} from '../../src';
  import {BarChartRenderer} from './BarChart-renderer';

  export default {
    data() {
      return {
        chart: null
      }
    },
    computed: {},
    mounted() {
      this.chart = new CoreChart(this.$refs.canvas);
      this.chart.installPlugin(new BarChartRenderer());

      this.updateSize();

      this.chart.setData([
        {x: 3, y: 2},
        {x: 5, y: 4},
        {x: 7, y: 8},
        {x: 9, y: 3},
        {x: 10, y: 6}
      ]);

      this.chart.setViewPortLimit({
        x: { min: 1, max: 12 },
        y: { min: 0, max: 10 }
      });

      this.chart.setViewPort({
        x: { min: 3, max: 10 },
        y: { min: 1, max: 9 }
      });

      // Events
      window.addEventListener('resize', this.onResize, false);

      this.chart.installPlugin(new PinchPanManager());
    },
    beforeDestroy(){
      console.log('beforeDestroy');
      window.removeEventListener('resize', this.onResize);
      this.chart.dispose();
    },
    methods: {
      updateSize(){
        const canvas = this.$refs.canvas;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        this.chart.setCanvasViewPort({
          x: { min: 10, max: canvas.width-10 },
          y: { min: 10, max: canvas.height-10 }
        });
      },
      onResize(){
        this.updateSize();
        this.chart.render();
      }
    },
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
