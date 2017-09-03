import {Axis, YAxis} from '../Axis';
import {DataPoint} from "../util";

describe('Axis', ()=>{

  describe('space mapping', ()=>{
    it('should translate the axis value to canvas value', ()=>{
      const axis = new Axis('whatever');

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).toBeCloseTo(5);

      axis.setCanvasViewPort({min: 0, max: 5});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).toBeCloseTo(2.5);

      axis.setCanvasViewPort({min: 5, max: 10});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).toBeCloseTo(7.5);

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 2.5, max: 7.5});
      expect(axis.d2c(5)).toBeCloseTo(5);

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 0, max: 5});
      expect(axis.d2c(5)).toBeCloseTo(10);
    });

    it('c2d and d2c should be the inverse function of each other', ()=>{
      const axis = new Axis('whatever');

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.c2d(axis.d2c(5))).toBeCloseTo(5);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.c2d(axis.d2c(7))).toBeCloseTo(7);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.d2c(axis.c2d(12))).toBeCloseTo(12);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.d2c(axis.c2d(-120))).toBeCloseTo(-120);
    });
  });


  describe('ViewPort',()=>{
    describe('should limit the view port within the limit', ()=>{
      let axis: Axis;
      beforeEach(()=>axis = new Axis('whatever'));

      it('inside the bound', ()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.settleViewPort();
        expect(axis.getViewPort().min).toBeCloseTo(0);
        expect(axis.getViewPort().max).toBeCloseTo(5);
      });

      it('overlap the bound', ()=> {
        axis.setViewPortLimit({min: -5, max: 3});
        axis.setViewPort({min: 0, max: 5});
        axis.settleViewPort();
        expect(axis.getViewPort().min).toBeCloseTo(-2, 0.01);
        expect(axis.getViewPort().max).toBeCloseTo(3, 0.01);

        axis.setViewPortLimit({min: 1, max: 10});
        axis.setViewPort({min: 0, max: 5});
        axis.settleViewPort();
        expect(axis.getViewPort().min).toBeCloseTo(1, 0.01);
        expect(axis.getViewPort().max).toBeCloseTo(6, 0.01);
      });

      it('outside the bound', ()=> {
        axis.setViewPortLimit({min: 1, max: 10});
        axis.setViewPort({min: -11, max: -10});
        axis.settleViewPort();
        expect(axis.getViewPort().min).toBeCloseTo(1, 0.01);
        expect(axis.getViewPort().max).toBeCloseTo(2, 0.01);

        axis.setViewPortLimit({min: 1, max: 10});
        axis.setViewPort({min: 11, max: 12});
        axis.settleViewPort();
        expect(axis.getViewPort().min).toBeCloseTo(9, 0.01);
        expect(axis.getViewPort().max).toBeCloseTo(10, 0.01);
      });

      it('viewPort larger than limit', ()=> {
        axis.setViewPortLimit({min: 1, max: 10});
        axis.setViewPort({min: 0, max: 40});
        axis.settleViewPort();
        expect(axis.getViewPort().min).toBeCloseTo(1, 0.01);
        expect(axis.getViewPort().max).toBeCloseTo(10, 0.01);
      });
    });

    describe('scrolling', ()=>{
      let axis: Axis;
      beforeEach(()=>axis = new Axis('whatever'));

      it('scroll without limit',()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.setViewPortLimit({min: 0, max: 5});
        axis.scroll(100000000);
        expect(axis.getViewPort().min).toBeCloseTo(100000000);
        expect(axis.getViewPort().max).toBeCloseTo(100000005);
        expect(axis.shouldUpdateViewPort).toBe(true);

        // after settling
        axis.settleViewPort();
        expect(axis.shouldUpdateViewPort).toBe(false);
        expect(axis.getViewPort().min).toBeCloseTo(0);
        expect(axis.getViewPort().max).toBeCloseTo(5);

        expect(axis.getViewPortLimit().min).toBeCloseTo(0);
        expect(axis.getViewPortLimit().max).toBeCloseTo(5);
      });

      it('scroll also the limit bound', ()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.setViewPortLimit({min: 0, max: 5});
        axis.scroll(100000000, true);
        expect(axis.getViewPort().min).toBeCloseTo(100000000);
        expect(axis.getViewPort().max).toBeCloseTo(100000005);
        expect(axis.shouldUpdateViewPort).toBe(true);

        // after settling
        axis.settleViewPort();
        expect(axis.shouldUpdateViewPort).toBe(false);
        expect(axis.getViewPort().min).toBeCloseTo(100000000);
        expect(axis.getViewPort().max).toBeCloseTo(100000005);

        expect(axis.getViewPortLimit().min).toBeCloseTo(100000000);
        expect(axis.getViewPortLimit().max).toBeCloseTo(100000005);
      });

      it('scroll in pixel', ()=>{
        axis.setCanvasViewPort({min: 0, max: 5});
        axis.setViewPort({min: 0, max: 5});
        axis.setViewPortLimit({min: -5, max: 10});

        axis.scrollInPx(5);
        expect(axis.getViewPort().min).toBeCloseTo(5);
        expect(axis.getViewPort().max).toBeCloseTo(10);

        axis.setCanvasViewPort({min: 0, max: 500});
        axis.setViewPort({min: 0, max: 5});
        axis.setViewPortLimit({min: -5, max: 10});

        axis.scrollInPx(100);
        expect(axis.getViewPort().min).toBeCloseTo(1);
        expect(axis.getViewPort().max).toBeCloseTo(6);
      });
    });

    describe('zooming', ()=>{
      let axis: Axis;
      beforeEach(()=>axis = new Axis('whatever'));

      it('zoom',()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.zoom(2);
        expect(axis.getViewPort().min).toBeCloseTo(-2.5);
        expect(axis.getViewPort().max).toBeCloseTo(7.5);
        expect(axis.shouldUpdateViewPort).toBe(true);
      });

      it('zoom with center specified',()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.zoom(2, 0);
        expect(axis.getViewPort().min).toBeCloseTo(0);
        expect(axis.getViewPort().max).toBeCloseTo(10);
        expect(axis.shouldUpdateViewPort).toBe(true);
      });

      it('zoomInPx',()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.setCanvasViewPort({min: 1242, max: 74839});
        axis.zoomFromCanvasPx(2);
        expect(axis.getViewPort().min).toBeCloseTo(-2.5);
        expect(axis.getViewPort().max).toBeCloseTo(7.5);
        expect(axis.shouldUpdateViewPort).toBe(true);
        axis.settleViewPort();

        axis.setViewPort({min: 0, max: 5});
        axis.setCanvasViewPort({min: 50, max: 100});
        axis.zoomFromCanvasPx(2, 75);
        expect(axis.getViewPort().min).toBeCloseTo(-2.5);
        expect(axis.getViewPort().max).toBeCloseTo(7.5);
        expect(axis.shouldUpdateViewPort).toBe(true);
        axis.settleViewPort();

        axis.setViewPort({min: 0, max: 5});
        axis.setCanvasViewPort({min: 50, max: 100});
        axis.zoomFromCanvasPx(2, 50);
        expect(axis.getViewPort().min).toBeCloseTo(0);
        expect(axis.getViewPort().max).toBeCloseTo(10);
        expect(axis.shouldUpdateViewPort).toBe(true);
      });
    });
  });


  describe('find the range of the viewable points', ()=>{
    let axis: Axis, points: DataPoint[];
    beforeEach(()=>{
      axis = new Axis('axisName');
      points = [1,2,3.3,4,6,6.5,7,7.1,8,9,10].map(axisName=>({axisName}))
    });

    it('includes all',()=>{
      axis.setViewPort({min: 0, max: 40});
      let result = axis.findRenderingRangeOfPoints(points);
      expect(result.min).toBe(0);
      expect(result.max).toBe(10);
    });
    it('get exactly one more',()=>{
      axis.setViewPort({min: 2.5, max: 7.5});
      let result = axis.findRenderingRangeOfPoints(points);
      expect(result.min).toBe(1);
      expect(result.max).toBe(8);
    });
    it('just the overlapped value',()=>{
      axis.setViewPort({min: 2, max: 8});
      let result = axis.findRenderingRangeOfPoints(points);
      expect(result.min).toBe(1);
      expect(result.max).toBe(8);
    });
  });

  it('find the min max value of the points', ()=>{
    const axis = new Axis('axisName');
    const points = [1,6,3.3,3,-6,6.6,7,7.1,20,9,10].map(axisName=>({axisName}));

    expect(axis.findMaxMinValueOfPoints(points)).toEqual({min:-6, max:20});
    expect(axis.findMaxMinValueOfPoints(points,1,4)).toEqual({min:-6,max:6});
  });

  describe('Ticks', ()=>{
    it('find ticks at a desired interval', ()=>{
      const axis = new Axis('whatever');
      axis.setViewPort({min: 0, max: 100});
      expect(axis.ticks(20).ticks).toEqual([0,20,40,60,80,100]);
      expect(axis.ticks(20).interval).toBe(20);

      axis.setViewPort({min: 5, max: 99});
      expect(axis.ticks(20).ticks).toEqual([0,20,40,60,80]);

      axis.setViewPort({min: -95, max: -10});
      expect(axis.ticks(20).ticks).toEqual([-100,-80,-60,-40,-20]);

      axis.setViewPort({min: -5, max: 5});
      expect(axis.ticks().ticks).toEqual([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
      expect(axis.ticks(0).ticks).toEqual([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
    });

    it('find a number of ticks', ()=>{
      const axis = new Axis('whatever');
      axis.setViewPort({min: 0, max: 10});

      expect(axis.ticksMax(6).ticks).toEqual([0,2,4,6,8,10]);
      expect(axis.ticksMax(6).interval).toBe(2);

      expect(axis.ticksMax(1).ticks.length).toBeLessThanOrEqual(1);

      expect(axis.ticksMax(17).ticks.length).toBeLessThanOrEqual(17);
      expect(axis.ticksMax(17).ticks.length).toBeGreaterThanOrEqual(8);

      expect(axis.ticksMax(100).ticks.length).toBeLessThanOrEqual(100);
      expect(axis.ticksMax(100).ticks.length).toBeGreaterThanOrEqual(50);
    });
  });
});

describe('YAxis', ()=>{

  describe('space mapping', ()=> {
    it('should translate the axis value to canvas value', () => {
      const axis = new YAxis('whatever');

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).toBeCloseTo(5, 0.01);

      axis.setCanvasViewPort({min: 0, max: 5});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).toBeCloseTo(2.5, 0.01);

      axis.setCanvasViewPort({min: 5, max: 10});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).toBeCloseTo(7.5, 0.01);

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 2.5, max: 7.5});
      expect(axis.d2c(5)).toBeCloseTo(5, 0.01);

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 0, max: 5});
      expect(axis.d2c(5)).toBeCloseTo(0, 0.01);
    });

    it('c2d and d2c should be the inverse function of each other', () => {
      const axis = new YAxis('whatever');

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.c2d(axis.d2c(5))).toBeCloseTo(5, 0.01);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.c2d(axis.d2c(7))).toBeCloseTo(7, 0.01);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.d2c(axis.c2d(12))).toBeCloseTo(12, 0.01);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.d2c(axis.c2d(-120))).toBeCloseTo(-120, 0.01);
    });
  });
});
