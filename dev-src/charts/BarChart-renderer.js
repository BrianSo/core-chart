
const viewPortLength = ({min, max})=> max-min;

export class BarChartRenderer{
  constructor(chart){
    this.chart = chart;
  }
  render(time, deltaTime){
    const ctx = this.chart.ctx;

    ctx.clearRect(0,0,this.chart.canvas.width, this.chart.canvas.height);

    ctx.save();
    let cvx = this.chart.getAxis('x').getCanvasViewPort();
    let cvy = this.chart.getAxis('y').getCanvasViewPort();

    ctx.beginPath();
    ctx.rect(cvx.min, cvy.min, viewPortLength(cvx), viewPortLength(cvy));
    ctx.stroke();
    ctx.clip();
    ctx.closePath();

    this.renderTicks(ctx, cvx, cvy);
    this.renderBar(ctx, cvx, cvy);
    ctx.restore();
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
  renderBar(ctx, cvx, cvy){

    ctx.strokeStyle = '#f00';
    ctx.fillStyle = "#600";

    const xScale = this.chart.getAxis('x').getScale();
    for(let pt of this.chart.data){
      pt = this.chart.d2c(pt);

      const width = 1 * xScale;
      const height = cvy.max - pt.y;

      ctx.fillRect(pt.x - width/2, pt.y, width, height);
    }
  }
}
