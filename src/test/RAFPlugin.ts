/**
 * Jasmine RequestAnimationFrame: a set of helpers for testing funcionality
 * that uses requestAnimationFrame under the Jasmine BDD framework for JavaScript.
 *
 * modified from https://gist.github.com/ischenkodv/43934774f4509fcb5791
 */
class MockRAF{
  private lastID: number;
  private time: number;
  private fns:{
    [key: number]: Function
  };

  constructor(){
    this.fns = {};
    this.lastID = 0;
    this.time = 0;
  }

  /**
   * Mock for window.requestAnimationFrame
   */
  private mockRAF(fn: FrameRequestCallback){
    if (typeof fn !== 'function') {
      throw new Error('You should pass a function to requestAnimationFrame');
    }

    this.lastID++;
    this.fns[this.lastID] = fn;
    return this.lastID;
  }

  /**
   * Mock for window.cancelAnimationFrame
   */
  private mockCAF(requestID: number){
    delete this.fns[requestID];
  }

  install() {
    spyOn(window, 'requestAnimationFrame').and.callFake(this.mockRAF.bind(this));
    spyOn(window, 'cancelAnimationFrame').and.callFake(this.mockCAF.bind(this));
  }

  /**
   * Simulate animation frame readiness.
   */
  tick(timeToPass = 0) {
    this.time += timeToPass || (Math.random() * 4 / 3 + 16); // range 16.0 - 17.333
    let fns = this.fns;
    this.fns = {};
    for (let i in fns){
      fns[i].call(window, this.time);
    }
  };
}

declare namespace jasmine{
  export const RequestAnimationFrame:MockRAF;
}

(jasmine as any).RequestAnimationFrame = new MockRAF();
