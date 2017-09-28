
const viewPortLength = ({min, max})=> max-min;

export class LineChartRenderer{
  constructor(chart){
    this.chart = chart;
  }

  render(time, deltaTime, shouldRenderPreview) {
    const ctx = this.chart.ctx;

    ctx.clearRect(0, 0, this.chart.canvas.width, this.chart.canvas.height);

    ctx.save();
    let cvx = this.chart.getAxis('x').getCanvasViewPort();
    let cvy = this.chart.getAxis('y').getCanvasViewPort();

    ctx.beginPath();
    ctx.rect(cvx.min, cvy.min, viewPortLength(cvx), viewPortLength(cvy));
    ctx.stroke();
    ctx.clip();
    ctx.closePath();

    this.renderTicks(ctx, cvx, cvy);
    this.renderLine(ctx, cvx, cvy);
    if(shouldRenderPreview)
      this.renderPreview(ctx, cvx, cvy);
//      this.renderMaker(ctx, cvx, cvy);
    ctx.restore();
  }

  renderPreview(ctx, cvx, cvy){

    const previewCanvasRegion = {
      x:{
        min: 20, max: 320
      },
      y:{
        min: 20, max: 100
      }
    };

    const xAxis = this.chart.getAxis('x');
    const yAxis = this.chart.getAxis('y');
    const xAxisViewPort = xAxis.getViewPort();
    const yAxisViewPort = yAxis.getViewPort();
    const xAxisCanvasViewPort = xAxis.getCanvasViewPort();
    const yAxisCanvasViewPort = yAxis.getCanvasViewPort();
    const yAxisViewPortLimit = yAxis.getViewPortLimit();
    xAxis.setCanvasViewPort(previewCanvasRegion.x);
    yAxis.setCanvasViewPort(previewCanvasRegion.y);
    xAxis.setViewPort(xAxis.getViewPortLimit());

    let minMax = yAxis.findMaxMinValueOfPoints(this.chart.data);

    yAxis.setViewPortLimit(minMax);
    yAxis.setViewPort(minMax);
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.beginPath();
    ctx.rect(previewCanvasRegion.x.min,previewCanvasRegion.y.min, viewPortLength(previewCanvasRegion.x), viewPortLength(previewCanvasRegion.y));
    ctx.fill();
    ctx.closePath();
    this.renderLine(ctx, previewCanvasRegion.x, previewCanvasRegion.y);
    ctx.beginPath();
    ctx.rect(xAxis.d2c(xAxisViewPort.min), yAxis.d2c(yAxisViewPort.min),
      xAxis.d2c(xAxisViewPort.max)-xAxis.d2c(xAxisViewPort.min),
      yAxis.d2c(yAxisViewPort.max)-yAxis.d2c(yAxisViewPort.min));
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    xAxis.setCanvasViewPort(xAxisCanvasViewPort);
    yAxis.setCanvasViewPort(yAxisCanvasViewPort);
    xAxis.setViewPort(xAxisViewPort);
    yAxis.setViewPort(yAxisViewPort);
    yAxis.setViewPortLimit(yAxisViewPortLimit);
  }

  renderTicks(ctx, cvx, cvy) {
    const xAxis = this.chart.getAxis('x');
    const yAxis = this.chart.getAxis('y');
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
    if (this.chart.data.length) {
      let {min, max} = this.chart.getAxis('x').findRenderingRangeOfPoints(this.chart.data);
      let start = this.chart.d2c(this.chart.data[min]);
      let end = this.chart.d2c(this.chart.data[max]);

      ctx.beginPath();
      ctx.lineTo(start.x, start.y);
      for (let i = min; i <= max; i++) {
        let pt = this.chart.data[i];
        pt = this.chart.d2c(pt);
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
    for (let pt of this.chart.data) {
      pt = this.chart.d2c(pt);
      ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
    }
  }
}
