import {Axis, YAxis} from '../Axis';


describe('Axis', ()=>{

  describe('space mapping', ()=>{
    it('should translate the axis value to canvas value', ()=>{
      const axis = new Axis('whatever');

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).to.be.closeTo(5, 0.01);

      axis.setCanvasViewPort({min: 0, max: 5});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).to.be.closeTo(2.5, 0.01);

      axis.setCanvasViewPort({min: 5, max: 10});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).to.be.closeTo(7.5, 0.01);

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 2.5, max: 7.5});
      expect(axis.d2c(5)).to.be.closeTo(5, 0.01);

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 0, max: 5});
      expect(axis.d2c(5)).to.be.closeTo(10, 0.01);
    });

    it('c2d and d2c should be the inverse function of each other', ()=>{
      const axis = new Axis('whatever');

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.c2d(axis.d2c(5))).to.be.closeTo(5, 0.01);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.c2d(axis.d2c(7))).to.be.closeTo(7, 0.01);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.d2c(axis.c2d(12))).to.be.closeTo(12, 0.01);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.d2c(axis.c2d(-120))).to.be.closeTo(-120, 0.01);
    });
  });


  describe('ViewPort',()=>{
    describe('should limit the view port within the limit', ()=>{
      let axis;
      beforeEach(()=>axis = new Axis('whatever'));

      it('inside the bound', ()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.settleViewPort();
        expect(axis.getViewPort().min).to.be.closeTo(0, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(5, 0.01);
      });

      it('overlap the bound', ()=> {
        axis.setViewPortLimit({min: -5, max: 3});
        axis.setViewPort({min: 0, max: 5});
        axis.settleViewPort();
        expect(axis.getViewPort().min).to.be.closeTo(-2, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(3, 0.01);

        axis.setViewPortLimit({min: 1, max: 10});
        axis.setViewPort({min: 0, max: 5});
        axis.settleViewPort();
        expect(axis.getViewPort().min).to.be.closeTo(1, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(6, 0.01);
      });

      it('outside the bound', ()=> {
        axis.setViewPortLimit({min: 1, max: 10});
        axis.setViewPort({min: -11, max: -10});
        axis.settleViewPort();
        expect(axis.getViewPort().min).to.be.closeTo(1, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(2, 0.01);

        axis.setViewPortLimit({min: 1, max: 10});
        axis.setViewPort({min: 11, max: 12});
        axis.settleViewPort();
        expect(axis.getViewPort().min).to.be.closeTo(9, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(10, 0.01);
      });

      it('viewPort larger than limit', ()=> {
        axis.setViewPortLimit({min: 1, max: 10});
        axis.setViewPort({min: 0, max: 40});
        axis.settleViewPort();
        expect(axis.getViewPort().min).to.be.closeTo(1, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(10, 0.01);
      });
    });

    describe('scrolling', ()=>{
      let axis;
      beforeEach(()=>axis = new Axis('whatever'));

      it('scroll without limit',()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.setViewPortLimit({min: 0, max: 5});
        axis.scroll(100000000);
        expect(axis.getViewPort().min).to.be.closeTo(100000000, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(100000005, 0.01);
        expect(axis.shouldUpdateViewPort).to.be.equal(true);

        // after settling
        axis.settleViewPort();
        expect(axis.shouldUpdateViewPort).to.be.equal(false);
        expect(axis.getViewPort().min).to.be.closeTo(0, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(5, 0.01);

        expect(axis.getViewPortLimit().min).to.be.closeTo(0, 0.01);
        expect(axis.getViewPortLimit().max).to.be.closeTo(5, 0.01);
      });

      it('scroll also the limit bound', ()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.setViewPortLimit({min: 0, max: 5});
        axis.scroll(100000000, true);
        expect(axis.getViewPort().min).to.be.closeTo(100000000, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(100000005, 0.01);
        expect(axis.shouldUpdateViewPort).to.be.equal(true);

        // after settling
        axis.settleViewPort();
        expect(axis.shouldUpdateViewPort).to.be.equal(false);
        expect(axis.getViewPort().min).to.be.closeTo(100000000, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(100000005, 0.01);

        expect(axis.getViewPortLimit().min).to.be.closeTo(100000000, 0.01);
        expect(axis.getViewPortLimit().max).to.be.closeTo(100000005, 0.01);
      });

      it('scroll in pixel', ()=>{
        axis.setCanvasViewPort({min: 0, max: 5});
        axis.setViewPort({min: 0, max: 5});
        axis.setViewPortLimit({min: -5, max: 10});

        axis.scrollInPx(5);
        expect(axis.getViewPort().min).to.be.closeTo(5, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(10, 0.01);

        axis.setCanvasViewPort({min: 0, max: 500});
        axis.setViewPort({min: 0, max: 5});
        axis.setViewPortLimit({min: -5, max: 10});

        axis.scrollInPx(100);
        expect(axis.getViewPort().min).to.be.closeTo(1, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(6, 0.01);
      });
    });

    describe('zooming', ()=>{
      let axis;
      beforeEach(()=>axis = new Axis('whatever'));

      it('zoom',()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.zoom(2);
        expect(axis.getViewPort().min).to.be.closeTo(-2.5, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(7.5, 0.01);
        expect(axis.shouldUpdateViewPort).to.be.equal(true);
      });

      it('zoom with center specified',()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.zoom(2, 0);
        expect(axis.getViewPort().min).to.be.closeTo(0, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(10, 0.01);
        expect(axis.shouldUpdateViewPort).to.be.equal(true);
      });

      it('zoomInPx',()=>{
        axis.setViewPort({min: 0, max: 5});
        axis.setCanvasViewPort({min: 1242, max: 74839});
        axis.zoomFromCanvasPx(2);
        expect(axis.getViewPort().min).to.be.closeTo(-2.5, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(7.5, 0.01);
        expect(axis.shouldUpdateViewPort).to.be.equal(true);
        axis.settleViewPort();

        axis.setViewPort({min: 0, max: 5});
        axis.setCanvasViewPort({min: 50, max: 100});
        axis.zoomFromCanvasPx(2, 75);
        expect(axis.getViewPort().min).to.be.closeTo(-2.5, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(7.5, 0.01);
        expect(axis.shouldUpdateViewPort).to.be.equal(true);
        axis.settleViewPort();

        axis.setViewPort({min: 0, max: 5});
        axis.setCanvasViewPort({min: 50, max: 100});
        axis.zoomFromCanvasPx(2, 50);
        expect(axis.getViewPort().min).to.be.closeTo(0, 0.01);
        expect(axis.getViewPort().max).to.be.closeTo(10, 0.01);
        expect(axis.shouldUpdateViewPort).to.be.equal(true);
      });
    });
  });


  describe('find the range of the viewable points', ()=>{
    let axis, points;
    beforeEach(()=>{
      axis = new Axis('axisName');
      points = [1,2,3.3,4,6,6.5,7,7.1,8,9,10].map(axisName=>({axisName}))
    });

    it('includes all',()=>{
      axis.setViewPort({min: 0, max: 40});
      let result = axis.findRenderingRangeOfPoints(points);
      expect(result.min).to.be.equal(0);
      expect(result.max).to.be.equal(10);
    });
    it('get exactly one more',()=>{
      axis.setViewPort({min: 2.5, max: 7.5});
      let result = axis.findRenderingRangeOfPoints(points);
      expect(result.min).to.be.equal(1);
      expect(result.max).to.be.equal(8);
    });
    it('just the overlapped value',()=>{
      axis.setViewPort({min: 2, max: 8});
      let result = axis.findRenderingRangeOfPoints(points);
      expect(result.min).to.be.equal(1);
      expect(result.max).to.be.equal(8);
    });
  });

  it('find the min max value of the points', ()=>{
    const axis = new Axis('axisName');
    const points = [1,6,3.3,3,-6,6.6,7,7.1,20,9,10].map(axisName=>({axisName}));

    expect(axis.findMaxMinValueOfPoints(points)).to.be.deep.equal({min:-6, max:20});
    expect(axis.findMaxMinValueOfPoints(points,1,4)).to.be.deep.equal({min:-6,max:6});
  });

  describe('Ticks', ()=>{
    it('find ticks at a desired interval', ()=>{
      const axis = new Axis('whatever');
      axis.setViewPort({min: 0, max: 100});
      expect(axis.ticks(20).ticks).to.be.deep.equal([0,20,40,60,80,100]);
      expect(axis.ticks(20).interval).to.be.equal(20);

      axis.setViewPort({min: 5, max: 99});
      expect(axis.ticks(20).ticks).to.be.deep.equal([0,20,40,60,80]);

      axis.setViewPort({min: -95, max: -10});
      expect(axis.ticks(20).ticks).to.be.deep.equal([-100,-80,-60,-40,-20]);

      axis.setViewPort({min: -5, max: 5});
      expect(axis.ticks().ticks).to.be.deep.equal([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
      expect(axis.ticks(0).ticks).to.be.deep.equal([-5,-4,-3,-2,-1,0,1,2,3,4,5]);
    });

    it('find a number of ticks', ()=>{
      const axis = new Axis('whatever');
      axis.setViewPort({min: 0, max: 10});

      expect(axis.ticksMax(6).ticks).to.be.deep.equal([0,2,4,6,8,10]);
      expect(axis.ticksMax(6).interval).to.be.equal(2);

      expect(axis.ticksMax(1).ticks.length).to.be.at.most(1);

      expect(axis.ticksMax(17).ticks.length).to.be.at.most(17);
      expect(axis.ticksMax(17).ticks.length).to.be.at.least(8);

      expect(axis.ticksMax(100).ticks.length).to.be.at.most(100);
      expect(axis.ticksMax(100).ticks.length).to.be.at.least(50);
    });
  });
});

describe('YAxis', ()=>{

  describe('space mapping', ()=> {
    it('should translate the axis value to canvas value', () => {
      const axis = new YAxis('whatever');

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).to.be.closeTo(5, 0.01);

      axis.setCanvasViewPort({min: 0, max: 5});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).to.be.closeTo(2.5, 0.01);

      axis.setCanvasViewPort({min: 5, max: 10});
      axis.setViewPort({min: 0, max: 10});
      expect(axis.d2c(5)).to.be.closeTo(7.5, 0.01);

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 2.5, max: 7.5});
      expect(axis.d2c(5)).to.be.closeTo(5, 0.01);

      axis.setCanvasViewPort({min: 0, max: 10});
      axis.setViewPort({min: 0, max: 5});
      expect(axis.d2c(5)).to.be.closeTo(0, 0.01);
    });

    it('c2d and d2c should be the inverse function of each other', () => {
      const axis = new YAxis('whatever');

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.c2d(axis.d2c(5))).to.be.closeTo(5, 0.01);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.c2d(axis.d2c(7))).to.be.closeTo(7, 0.01);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.d2c(axis.c2d(12))).to.be.closeTo(12, 0.01);

      axis.setCanvasViewPort({min: 3, max: 10});
      axis.setViewPort({min: 7, max: 12});
      expect(axis.d2c(axis.c2d(-120))).to.be.closeTo(-120, 0.01);
    });
  });
});
