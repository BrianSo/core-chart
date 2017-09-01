<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
  import PinchPanManager from '../../src/plugins/PinchPan';
  import {CoreChart, Axis, YAxis, util} from '../../src';
  const {viewPortLength} = util;

  class MyChart extends CoreChart {
    render(time, deltaTime) {
      super.render(time, deltaTime);
      const ctx = this.ctx;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.save();
      let cvx = this.getAxise('x').getCanvasViewPort();
      let cvy = this.getAxise('y').getCanvasViewPort();

      ctx.beginPath();
      ctx.rect(cvx.min, cvy.min, viewPortLength(cvx), viewPortLength(cvy));
      ctx.stroke();
//      ctx.clip();
      ctx.closePath();

      this.renderTicks(ctx, cvx, cvy);
      this.renderLine(ctx, cvx, cvy);
      //this.renderMaker(ctx, cvx, cvy);
      ctx.restore();
    }


    renderTicks(ctx, cvx, cvy) {
      const xAxis = this.getAxise('x');
      const yAxis = this.getAxise('y');
      const xTicks = xAxis.ticksMax(13).ticks;
      const yTicks = yAxis.ticksMax(8).ticks;

      ctx.save();

      ctx.setLineDash([5,3]);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;

//      const xDashLine = 8 * xAxis.getScale();
//      ctx.lineDashOffset = (xAxis.getViewPort().min % xDashLine)/xAxis.getScale();

      for(const t of xTicks){
        ctx.beginPath();

        let x = xAxis.d2c(t);
        ctx.lineTo(x, cvy.min);
        ctx.lineTo(x, cvy.max);
        ctx.stroke();
        ctx.closePath();

        let text = ctx.measureText(String(t));
        ctx.fillText(String(t), x - text.width/2, cvy.max - 2);
      }

//      const yDashLine = 8 * yAxis.getScale();
//      ctx.lineDashOffset = (yAxis.getViewPort().min % yDashLine)/yAxis.getScale();

      for(const t of yTicks){
        ctx.beginPath();

        let y = yAxis.d2c(t);
        ctx.lineTo(cvx.min, y);
        ctx.lineTo(cvx.max, y);
        ctx.stroke();
        ctx.closePath();

        ctx.fillText(String(t), cvx.min + 2, y - 2);
      }
      ctx.restore();
    }
    renderLine(ctx, cvx, cvy) {
      if (this.data.length) {
        let {min, max} = this.getAxise('x').findRenderingRangeOfPoints(this.data);
        let start = this.d2c(this.data[min]);
        let end = this.d2c(this.data[max]);

        ctx.beginPath();
        ctx.lineTo(start.x, start.y);
        for (let i = min; i <= max; i++) {
          let pt = this.data[i];
          pt = this.d2c(pt);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

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

    renderMaker(ctx, cvx, cvy) {

      ctx.strokeStyle = '#f00';
      ctx.fillStyle = "#600";
      for (let pt of this.data) {
        pt = this.d2c(pt);
        ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
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
      xAxis.setViewPort({
        min: 0, max: 100
      });
      yAxis.setViewPort({
        min: 1, max: 9
      });
      xAxis.setViewPortLimit({
        min: 1, max: 999
      });
      yAxis.setViewPortLimit({
        min: 0, max: max
      });

      // Events

      // automatic find suitable viewport for y axis
      this.chart.on('beforeRender', ()=>{
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
