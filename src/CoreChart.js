


export default class CoreChart{
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.axises = {};
    this.data = [];
    this.renderId = -1;
  }

  setData(data){
    this.data = data;
    this.renderInNextFrame();
  }

  scroll(axisDiffs){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].scroll(axisDiffs[key]);
    }
    this.renderInNextFrame();
  }
  scrollInPx(axisDiffs){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].scrollInPx(axisDiffs[key]);
    }
    this.renderInNextFrame();
  }
  zoom(axisDiffs, center){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].zoom(axisDiffs[key], center[key]);
    }
    this.renderInNextFrame();
  }
  zoomFromCanvasPx(axisDiffs, centerInCanvasPx){
    for(const key of Object.keys(axisDiffs)){
      this.axises[key] && this.axises[key].zoomFromCanvasPx(axisDiffs[key], centerInCanvasPx[key]);
    }
    this.renderInNextFrame();
  }
  setViewPort(axisViewPorts){
    for(const key of Object.keys(axisViewPorts)){
      this.axises[key] && this.axises[key].setViewPort(axisViewPorts[key]);
    }
    this.renderInNextFrame();
  }

  d2c(dataInAxisValue){
    const result = {};
    for(const key of Object.keys(dataInAxisValue)){
      if(this.axises[key])
        result[key] = this.axises[key].d2c(dataInAxisValue[key]);
    }
    return result;
  }
  c2d(dataInCanvasValue){
    const result = {};
    for(const key of Object.keys(dataInCanvasValue)){
      if(this.axises[key])
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
  }
}
