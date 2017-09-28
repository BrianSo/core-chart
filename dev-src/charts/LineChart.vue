<template>
    <div>
      <canvas ref="canvas"></canvas>
      <input type="checkbox" id="render_preview_ck_box" v-model="shouldRenderPreview"><label for="render_preview_ck_box">Render Preview</label>
    </div>
</template>

<script>
  import PinchPanManager from '../../src/plugins/PinchPan';
  import {CoreChart, Axis, YAxis, util} from '../../src';
  import {LineChartRenderer} from "./LineChart-renderer";
  const {viewPortLength} = util;

  function updateSize(){
    const canvas = this.$refs.canvas;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    this.chart.setCanvasViewPort({
      x: { min: 10, max: canvas.width-10 },
      y: { min: 10, max: canvas.height-10 }
    });
  }

  function onResize(){
    updateSize.call(this);
    this.chart.render();
  }

  export default {
    data() {
      return {
        chart: null,
        resizeListener: null,
        shouldRenderPreview: false,
      }
    },
    computed: {},
    watch:{
      shouldRenderPreview(val){
        this.chart.renderInNextFrame();
      }
    },
    mounted() {
      this.chart = new CoreChart(this.$refs.canvas);
      let renderer = new LineChartRenderer(this.chart);
      this.chart.on('render', (time, deltaTime)=>renderer.render(time, deltaTime, this.shouldRenderPreview));

      this.chart.setAxis(new Axis('x'));
      this.chart.setAxis(new YAxis('y'));

      updateSize.call(this);

      let data = [];
      let max = 0;

      data.push({
        x:0,
        y:5
      });
      let i = 1;
      for(; i < 1000; i++){
        let y = data[i-1].y *  (0.8 + Math.random() * 0.41);
        if(y>max)max = y;
        data.push({
          x:i,
          y:y
        });
      }

      setInterval(()=>{
        data.shift();
        let y = data[data.length - 1].y *  (0.8 + Math.random() * 0.41);
        if(y>max)max = y;
        data.push({
          x:i++,
          y:y
        });

        this.chart.scroll({x:1}, true, {animated: true});
        this.chart.renderInNextFrame();
      },1000);

      this.chart.setData(data);

      this.chart.setViewPortLimit({
        x: { min: 1, max: 999 },
        y: { min: 0, max: max }
      });

      this.chart.setViewPort({
        x: { min: 0, max: 100 },
        y: { min: 1, max: 9 }
      });

      // Events

      // automatic find suitable viewport for y axis
      this.chart.on('beforeRender', ()=>{
        const xAxis = this.chart.getAxis('x');
        const yAxis = this.chart.getAxis('y');
        let range = xAxis.findRenderingRangeOfPoints(this.chart.data);
        let {min, max} = yAxis.findMaxMinValueOfPoints(this.chart.data, range.min, range.max);

        let length = max - min;
        max += length * 0.1;
        min -= length * 0.1;
        this.chart.setViewPortLimit({y:{min,max}});
        this.chart.setViewPort({y:{min,max}});
      });
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
