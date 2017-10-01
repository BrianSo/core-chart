import CoreChart from '../CoreChart';
import './RAFPlugin';
import {Axis} from "../Axis";

describe('CoreChart', ()=>{
  let canvas : HTMLCanvasElement;
  beforeEach(()=>{
    canvas = document.createElement('Canvas') as HTMLCanvasElement;
  });

  describe('create', ()=>{

    it('Create CoreChart successfully',()=>{
      const chart = new CoreChart(canvas);
      expect(chart).toBeTruthy();
    });
  });

  describe('CoreChart will be rendered when data change',()=>{
    let chart: CoreChart;
    let callTime = 0;
    beforeAll(()=>{
      chart = new CoreChart(canvas);
      jasmine.RequestAnimationFrame.install();
      spyOn(chart,'render');
    });

    it('should rerender whenever data is changed', ()=>{
      chart.invalidate();
      callTime++;
      expect(requestAnimationFrame).toHaveBeenCalledTimes(callTime);
      jasmine.RequestAnimationFrame.tick();
      expect(chart.render).toHaveBeenCalledTimes(callTime);
    });

    it('setCanvasViewPort',()=>{
      chart.setCanvasViewPort({
        x: {min: 1, max: 2},
        y: {min: 2, max: 1}
      });
      callTime++;
      expect(requestAnimationFrame).toHaveBeenCalledTimes(callTime);
      jasmine.RequestAnimationFrame.tick();
      expect(chart.render).toHaveBeenCalledTimes(callTime);
    });
    it('setViewPortLimit',()=>{
      chart.setViewPortLimit({
        x: {min: 1, max: 2},
        y: {min: 2, max: 1}
      });
      callTime++;
      expect(requestAnimationFrame).toHaveBeenCalledTimes(callTime);
      jasmine.RequestAnimationFrame.tick();
      expect(chart.render).toHaveBeenCalledTimes(callTime);
    });
    it('setViewPort',()=>{
      chart.setViewPort({
        x: {min: 1, max: 2},
        y: {min: 2, max: 1}
      });
      callTime++;
      expect(requestAnimationFrame).toHaveBeenCalledTimes(callTime);
      jasmine.RequestAnimationFrame.tick();
      expect(chart.render).toHaveBeenCalledTimes(callTime);
    });
    it('setViewPort',()=>{
      chart.setData([]);
      callTime++;
      expect(requestAnimationFrame).toHaveBeenCalledTimes(callTime);
      jasmine.RequestAnimationFrame.tick();
      expect(chart.render).toHaveBeenCalledTimes(callTime);
    });
  });

  describe('Forward calls', ()=>{
    let chart: CoreChart;
    let xAxis: Axis;
    let yAxis: Axis;
    beforeAll(()=>{
      chart = new CoreChart(canvas);
      xAxis = chart.getAxis('x');
      yAxis = chart.getAxis('y');
      jasmine.RequestAnimationFrame.install();
      spyOn(chart,'render');
    });

    it('should forward d2c calls to axises', ()=>{
      spyOn(xAxis, 'd2c');
      spyOn(yAxis, 'd2c');
      let value = chart.d2c({x: 413, y: 3123});
      expect(xAxis.d2c).toHaveBeenCalledWith(413);
      expect(yAxis.d2c).toHaveBeenCalledWith(3123);
      expect(value.x).toBe(xAxis.d2c(413));
      expect(value.y).toBe(yAxis.d2c(3123));
    });

    it('should forward c2d calls to axises', ()=>{
      spyOn(xAxis, 'c2d');
      spyOn(yAxis, 'c2d');
      let value = chart.c2d({x: 413, y: 3123});
      expect(xAxis.c2d).toHaveBeenCalledWith(413);
      expect(yAxis.c2d).toHaveBeenCalledWith(3123);
      expect(value.x).toBe(xAxis.c2d(413));
      expect(value.y).toBe(yAxis.c2d(3123));
    });

    it('should forward setViewPort calls to axises', ()=>{
      spyOn(xAxis, 'setViewPort');
      spyOn(yAxis, 'setViewPort');
      chart.setViewPort({x: {min: -12, max: 2}, y: {min: 7, max: 3}});
      expect(xAxis.setViewPort).toHaveBeenCalledWith({min: -12, max: 2});
      expect(yAxis.setViewPort).toHaveBeenCalledWith({min: 7, max: 3});
    });

    it('should forward setViewPortLimit calls to axises', ()=>{
      spyOn(xAxis, 'setViewPortLimit');
      spyOn(yAxis, 'setViewPortLimit');
      chart.setViewPortLimit({x: {min: -12, max: 2}, y: {min: 7, max: 3}});
      expect(xAxis.setViewPortLimit).toHaveBeenCalledWith({min: -12, max: 2});
      expect(yAxis.setViewPortLimit).toHaveBeenCalledWith({min: 7, max: 3});
    });

    it('should forward setCanvasViewPort calls to axises', ()=>{
      spyOn(xAxis, 'setCanvasViewPort');
      spyOn(yAxis, 'setCanvasViewPort');
      chart.setCanvasViewPort({x: {min: -12, max: 2}, y: {min: 7, max: 3}});
      expect(xAxis.setCanvasViewPort).toHaveBeenCalledWith({min: -12, max: 2});
      expect(yAxis.setCanvasViewPort).toHaveBeenCalledWith({min: 7, max: 3});
    });

    it('should forward scroll calls to axises', ()=>{
      spyOn(xAxis, 'scroll');
      spyOn(yAxis, 'scroll');
      chart.scroll({x: -51, y: 9}, false);
      expect(xAxis.scroll).toHaveBeenCalledWith(-51, false);
      expect(yAxis.scroll).toHaveBeenCalledWith(9, false);

      chart.scroll({x: -51, y: 9}, true);
      expect(xAxis.scroll).toHaveBeenCalledWith(-51, true);
      expect(yAxis.scroll).toHaveBeenCalledWith(9, true);

      // default parameter
      chart.scroll({x: -51, y: 9});
      expect(xAxis.scroll).toHaveBeenCalledWith(-51, false);
      expect(yAxis.scroll).toHaveBeenCalledWith(9, false);
    });

    it('should forward scrollInPx calls to axises', ()=>{
      spyOn(xAxis, 'scrollInPx');
      spyOn(yAxis, 'scrollInPx');
      chart.scrollInPx({x: -51, y: 9}, false);
      expect(xAxis.scrollInPx).toHaveBeenCalledWith(-51, false);
      expect(yAxis.scrollInPx).toHaveBeenCalledWith(9, false);

      chart.scrollInPx({x: -51, y: 9}, true);
      expect(xAxis.scrollInPx).toHaveBeenCalledWith(-51, true);
      expect(yAxis.scrollInPx).toHaveBeenCalledWith(9, true);

      // default parameter
      chart.scrollInPx({x: -51, y: 9});
      expect(xAxis.scrollInPx).toHaveBeenCalledWith(-51, false);
      expect(yAxis.scrollInPx).toHaveBeenCalledWith(9, false);
    });

    it('should forward zoom calls to axises', ()=>{
      spyOn(xAxis, 'zoom');
      spyOn(yAxis, 'zoom');
      chart.zoom({x: -51, y:9}, {x: 6, y:7});
      expect(xAxis.zoom).toHaveBeenCalledWith(-51, 6);
      expect(yAxis.zoom).toHaveBeenCalledWith(9, 7);

      chart.zoom({x: -51, y:9}, {x: 6});
      expect(xAxis.zoom).toHaveBeenCalledWith(-51, 6);
      expect(yAxis.zoom).toHaveBeenCalledWith(9, undefined);

      chart.zoom({x: -51, y:9});
      expect(xAxis.zoom).toHaveBeenCalledWith(-51, undefined);
      expect(yAxis.zoom).toHaveBeenCalledWith(9, undefined);
    });

    it('should forward zoomFromCanvasPx calls to axises', ()=>{
      spyOn(xAxis, 'zoomFromCanvasPx');
      spyOn(yAxis, 'zoomFromCanvasPx');
      chart.zoomFromCanvasPx({x: -51, y:9}, {x: 6, y:7});
      expect(xAxis.zoomFromCanvasPx).toHaveBeenCalledWith(-51, 6);
      expect(yAxis.zoomFromCanvasPx).toHaveBeenCalledWith(9, 7);

      chart.zoomFromCanvasPx({x: -51, y:9}, {x: 6});
      expect(xAxis.zoomFromCanvasPx).toHaveBeenCalledWith(-51, 6);
      expect(yAxis.zoomFromCanvasPx).toHaveBeenCalledWith(9, undefined);

      chart.zoomFromCanvasPx({x: -51, y:9});
      expect(xAxis.zoomFromCanvasPx).toHaveBeenCalledWith(-51, undefined);
      expect(yAxis.zoomFromCanvasPx).toHaveBeenCalledWith(9, undefined);
    });

    it('should forward calls to EventEmitter', ()=>{
      let ee = (chart as any).ee;
      spyOn(ee,'addListener');
      spyOn(ee,'removeListener');
      spyOn(ee,'addOnceListener');

      let f1 = ()=>{};let f2 = ()=>{};let f3 = ()=>{};let f4 = ()=>{};let f5 = ()=>{};let f6 = ()=>{};

      chart.on('render',f1);
      expect(ee.addListener).toHaveBeenCalledWith('render',f1);

      chart.addListener('render',f2);
      expect(ee.addListener).toHaveBeenCalledWith('render',f2);

      chart.off('render', f3);
      expect(ee.removeListener).toHaveBeenCalledWith('render', f3);

      chart.removeListener('beforeRender',f4);
      expect(ee.removeListener).toHaveBeenCalledWith('beforeRender',f4);

      chart.once('beforeRender', f5);
      expect(ee.addOnceListener).toHaveBeenCalledWith('beforeRender', f5);

      chart.addOnceListener('beforeRender',f6);
      expect(ee.addOnceListener).toHaveBeenCalledWith('beforeRender',f6);
    });
  });

  describe('render', ()=>{
    let chart: CoreChart;
    let xAxis: Axis;
    let yAxis: Axis;
    beforeAll(()=>{
      chart = new CoreChart(canvas);
      xAxis = chart.getAxis('x');
      yAxis = chart.getAxis('y');
      jasmine.RequestAnimationFrame.install();
      spyOn(chart,'render').and.callThrough();
    });

    it('should settle the viewport before rendering', ()=>{
      spyOn(xAxis, 'settleViewPort');
      spyOn(yAxis, 'settleViewPort');
      chart.render(1, 1);
      expect(xAxis.settleViewPort).toHaveBeenCalled();
      expect(yAxis.settleViewPort).toHaveBeenCalled();
    });
  });

  describe('Event Hooks', ()=>{
    let chart: CoreChart;
    let xAxis: Axis;
    let yAxis: Axis;
    beforeAll(()=>{
      chart = new CoreChart(canvas);
      xAxis = chart.getAxis('x');
      yAxis = chart.getAxis('y');
      jasmine.RequestAnimationFrame.install();
      spyOn(chart,'render').and.callThrough();
    });

    it('call beforeRender in proper timing', ()=>{
      let cb = jasmine.createSpy('cb');
      chart.on('beforeRender', cb);
      chart.invalidate();

      expect(cb).not.toHaveBeenCalled();
      jasmine.RequestAnimationFrame.tick();
      expect(cb).toHaveBeenCalled();
    });

    it('call render in proper timing', ()=>{
      let cb = jasmine.createSpy('cb');
      chart.on('render', cb);
      chart.invalidate();

      expect(cb).not.toHaveBeenCalled();
      jasmine.RequestAnimationFrame.tick();
      expect(cb).toHaveBeenCalled();
    });

    it('call postRender in proper timing', ()=>{
      let cb = jasmine.createSpy('cb');
      chart.on('postRender', cb);
      chart.invalidate();

      expect(cb).not.toHaveBeenCalled();
      jasmine.RequestAnimationFrame.tick();
      expect(cb).toHaveBeenCalled();
    });

    it('call beforeRender, render and postRender in proper order', ()=>{
      let calls: string[] = [];
      let beforeRender = jasmine.createSpy('beforeRender').and.callFake(()=>calls.push('beforeRender'));
      let render = jasmine.createSpy('render').and.callFake(()=>calls.push('render'));
      let postRender = jasmine.createSpy('postRender').and.callFake(()=>calls.push('postRender'));

      chart.on('postRender', postRender);
      chart.on('beforeRender', beforeRender);
      chart.on('render', render);
      chart.invalidate();

      expect(beforeRender).not.toHaveBeenCalled();
      expect(render).not.toHaveBeenCalled();
      expect(postRender).not.toHaveBeenCalled();
      jasmine.RequestAnimationFrame.tick();
      expect(beforeRender).toHaveBeenCalled();
      expect(render).toHaveBeenCalled();
      expect(postRender).toHaveBeenCalled();
    });
  });
});
