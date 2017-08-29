


export default class CoreChart{
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.axises = {};
    this.data = [];
    this.renderId = -1;

    this.renderInNextFrame();
  }

  setData(data){
    this.data = data;
  }

  scroll(axisDiffs){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].scroll(axisDiffs[key]);
    }
  }
  zoom(axisDiffs){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].zoom(axisDiffs[key]);
    }
  }
  setViewPort(axisViewPorts){
    for(const key of Object.keys(axisViewPorts)){
      this.axises[key] && this.axises[key].setViewPort(axisViewPorts[key]);
    }
  }

  d2c(dataInAxisValue){
    const result = {};
    for(const key of Object.keys(dataInAxisValue)){
      result[key] = this.axises[key].d2c(dataInAxisValue[key]);
    }
    return result;
  }
  c2d(dataInCanvasValue){
    const result = {};
    for(const key of Object.keys(dataInCanvasValue)){
      result[key] = this.axises[key].c2d(dataInCanvasValue[key]);
    }
    return result;
  }

  setAxise(axis) {
    this.axises[axis.name] = axis;
  }

  getAxise(name){
    return this.axises[name];
  }
  removeAxise(name){
    delete this.axises[name];
  }

  getAllAxise(){
    return Object.keys(this.axises).map(name=>this.axises[name]);
  }

  renderInNextFrame(){
    if(this.renderId === -1){
      this.renderId = requestAnimationFrame(()=>this.render());
    }
  }
  render(){
    this.renderId = -1;

    const ctx = this.ctx;
    ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#f00';
    ctx.fillRect(10,10,10,10);
  }
}
