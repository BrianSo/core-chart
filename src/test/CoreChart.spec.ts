import CoreChart from '../CoreChart';
import './RAFPlugin';

describe('CoreChart', ()=>{

  describe('create', ()=>{
    let canvas : HTMLCanvasElement;
    beforeEach(()=>{
      canvas = document.createElement('Canvas') as HTMLCanvasElement;
    });

    it('Create CoreChart successfully',()=>{
      const chart = new CoreChart(canvas);
      expect(chart).toBeTruthy();
    });

    describe('CoreChart will be rendered when data change',()=>{
      let chart: CoreChart;
      beforeEach(()=>{
        chart = new CoreChart(canvas);
        jasmine.RequestAnimationFrame.install();
        spyOn(chart,'render');
      });

      it('setCanvasViewPort',()=>{
        chart.setCanvasViewPort({
          x: {min: 1, max: 2},
          y: {min: 2, max: 1}
        });
        expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
        jasmine.RequestAnimationFrame.tick();
        expect(chart.render).toHaveBeenCalled();
      });
      it('setViewPortLimit',()=>{
        chart.setViewPortLimit({
          x: {min: 1, max: 2},
          y: {min: 2, max: 1}
        });
        expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
        jasmine.RequestAnimationFrame.tick();
        expect(chart.render).toHaveBeenCalled();
      });
      it('setViewPort',()=>{
        chart.setViewPort({
          x: {min: 1, max: 2},
          y: {min: 2, max: 1}
        });
        expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
        jasmine.RequestAnimationFrame.tick();
        expect(chart.render).toHaveBeenCalled();
      });
      it('setViewPort',()=>{
        chart.setData([]);
        expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
        jasmine.RequestAnimationFrame.tick();
        expect(chart.render).toHaveBeenCalled();
      });
    });
  });
});
