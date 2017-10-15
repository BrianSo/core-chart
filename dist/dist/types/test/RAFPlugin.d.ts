/**
 * Jasmine RequestAnimationFrame: a set of helpers for testing funcionality
 * that uses requestAnimationFrame under the Jasmine BDD framework for JavaScript.
 *
 * modified from https://gist.github.com/ischenkodv/43934774f4509fcb5791
 */
declare class MockRAF {
    private lastID;
    private time;
    private fns;
    constructor();
    /**
     * Mock for window.requestAnimationFrame
     */
    private mockRAF(fn);
    /**
     * Mock for window.cancelAnimationFrame
     */
    private mockCAF(requestID);
    install(): void;
    /**
     * Simulate animation frame readiness.
     */
    tick(timeToPass?: number): void;
}
declare namespace jasmine {
    const RequestAnimationFrame: MockRAF;
}
