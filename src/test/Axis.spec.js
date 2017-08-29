import Axis from '../Axis';


describe('Axis', ()=>{

  it('should translate the axis value to canvas value', ()=>{
    const xAxis = new Axis('x');

    xAxis.setCanvasViewPort({min: 0, max: 10});
    xAxis.setViewPort({min: 0, max: 10});
    expect(xAxis.d2c(5)).to.be.closeTo(5, 0.01);

    xAxis.setCanvasViewPort({min: 0, max: 5});
    xAxis.setViewPort({min: 0, max: 10});
    expect(xAxis.d2c(5)).to.be.closeTo(2.5, 0.01);

    xAxis.setCanvasViewPort({min: 5, max: 10});
    xAxis.setViewPort({min: 0, max: 10});
    expect(xAxis.d2c(5)).to.be.closeTo(7.5, 0.01);

    xAxis.setCanvasViewPort({min: 0, max: 10});
    xAxis.setViewPort({min: 2.5, max: 7.5});
    expect(xAxis.d2c(5)).to.be.closeTo(5, 0.01);

    xAxis.setCanvasViewPort({min: 0, max: 10});
    xAxis.setViewPort({min: 0, max: 5});
    expect(xAxis.d2c(5)).to.be.closeTo(10, 0.01);
  });

  it('c2d and d2c should be the inverse function of each other', ()=>{
    const xAxis = new Axis('x');

    xAxis.setCanvasViewPort({min: 3, max: 10});
    xAxis.setViewPort({min: 7, max: 12});
    expect(xAxis.c2d(xAxis.d2c(5))).to.be.closeTo(5, 0.01);

    xAxis.setCanvasViewPort({min: 3, max: 10});
    xAxis.setViewPort({min: 7, max: 12});
    expect(xAxis.c2d(xAxis.d2c(7))).to.be.closeTo(7, 0.01);

    xAxis.setCanvasViewPort({min: 3, max: 10});
    xAxis.setViewPort({min: 7, max: 12});
    expect(xAxis.d2c(xAxis.c2d(12))).to.be.closeTo(12, 0.01);

    xAxis.setCanvasViewPort({min: 3, max: 10});
    xAxis.setViewPort({min: 7, max: 12});
    expect(xAxis.d2c(xAxis.c2d(-120))).to.be.closeTo(-120, 0.01);
  });

  it('should limit the view port within the limit', ()=>{

    // inside the bound

    const xAxis = new Axis('x');
    xAxis.setViewPort({min: 0, max: 5});
    xAxis.settleViewPort();
    expect(xAxis.getViewPort().min).to.be.closeTo(0, 0.01);
    expect(xAxis.getViewPort().max).to.be.closeTo(5, 0.01);

    // overlap the bound

    xAxis.setViewPortLimit({min: -5, max: 3});
    xAxis.setViewPort({min: 0, max: 5});
    xAxis.settleViewPort();
    expect(xAxis.getViewPort().min).to.be.closeTo(-2, 0.01);
    expect(xAxis.getViewPort().max).to.be.closeTo(3, 0.01);

    xAxis.setViewPortLimit({min: 1, max: 10});
    xAxis.setViewPort({min: 0, max: 5});
    xAxis.settleViewPort();
    expect(xAxis.getViewPort().min).to.be.closeTo(1, 0.01);
    expect(xAxis.getViewPort().max).to.be.closeTo(6, 0.01);

    // outside the bound

    xAxis.setViewPortLimit({min: 1, max: 10});
    xAxis.setViewPort({min: -11, max: -10});
    xAxis.settleViewPort();
    expect(xAxis.getViewPort().min).to.be.closeTo(1, 0.01);
    expect(xAxis.getViewPort().max).to.be.closeTo(2, 0.01);

    xAxis.setViewPortLimit({min: 1, max: 10});
    xAxis.setViewPort({min: 11, max: 12});
    xAxis.settleViewPort();
    expect(xAxis.getViewPort().min).to.be.closeTo(9, 0.01);
    expect(xAxis.getViewPort().max).to.be.closeTo(10, 0.01);

    // viewPort larger than limit
    xAxis.setViewPortLimit({min: 1, max: 10});
    xAxis.setViewPort({min: 0, max: 40});
    xAxis.settleViewPort();
    expect(xAxis.getViewPort().min).to.be.closeTo(1, 0.01);
    expect(xAxis.getViewPort().max).to.be.closeTo(10, 0.01);
  })
});

