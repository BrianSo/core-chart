# core-chart-js (alpha stage)

[![Build Status](https://travis-ci.org/BrianSo/core-chart.svg?branch=master)](https://travis-ci.org/BrianSo/core-chart)

This is a minimal library for building **complex, efficient and highly customized** chart. No rendering is included. 
Write the rendering by your self. Write the animation by your self.

## Why Core Chart?

1. High performance
2. Highly customizable
3. Built in zoom, pan support

[Chart.js](http://www.chartjs.org/) could handle most case. Also other 
libraries like amCharts provide many advance features too. However, 
it's often that we get some special requirements that the existing libraries 
does not provide. For example, a high performance chart that need to display
1000+ data points on a mobile device with pan and zoom.

Even though we found a library that suit the case currently, 
it is possible that the requirement change in the future and force you to 
change a library or even write your own. Core Chart is a project to be the 
base for building customized charts.

Note: If you just have complex requirement, you may consider Chart.js + plugins, 
however, at the time when I create this project, i didn't see much documentation
of how to write a chart.js plugin.

## Why Not Core Chart?

1. Need to write the rendering by your own, however we provide
2. Need more code to config a simple feature comparing to other charting library

## We offer you

The library offers you the base classes to create charts and sample codes to
render and optimize.

Only three classes you need to know:
1. CoreChart
2. Axis
3. Animation (optional)

Sample use case and codes:
1. LineChart
2. BarChart with label


## Quick start

Here is the quickest way to get started. But when you decided to write your own chart, 
you should understand the [core concepts](#getting-started) first.

```js

const canvas = document.getElementById('my-chart');

// data points
const data = [
  { x:1,   y:5 },
  { x:2,   y:3 },
  { x:3,   y:-2 },
  { x:4.5, y:4 },
  { x:5,   y:1 },
];

const chart = new CoreChart(canvas);

// set the region that the data should draw to
chart.setCanvasViewPort({
  x: { min: 0, max: canvas.width },
  y: { min: 0, max: canvas.height }
});

chart.setViewPortLimit({
  x: { min: 0, max: 6 },
  y: { min: -3, max: 6 }
});

chart.setViewPort({
  x: { min: 1.5, max: 4 },
  y: { min: -3, max: 4 }
});

// (optional) enable pinch and pan
new PinchPanManager(canvas, chart);

// Do your rendering
chart.on('render', (time, deltaTime) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.beginPath();
  for(const pt of data){
    const canvasPt = chart.d2c(pt);
    ctx.lineTo(canvasPt.x, canvasPt.y);
  }
  ctx.stroke();
  ctx.closePath();
});

```

You may make a bar chart like this

```js
chart.on('render', (time, deltaTime) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const xScale = chart.getAxis('x').getScale();
  const zeroY = chart.getAxis('y').d2c(0);
  const xCanvasViewPort = chart.getAxis('x').getCanvasViewPort();

  // draw base line on level y = 0
  ctx.beginPath();
  ctx.lineTo(xCanvasViewPort.min, zeroY);
  ctx.lineTo(xCanvasViewPort.max, zeroY);
  ctx.stroke();
  ctx.closePath();

  // width = 0.5 in data space
  const barWidth = 0.5 * xScale;

  for(const pt of data){
    const canvasPt = chart.d2c(pt);
    const barHeight = zeroY - canvasPt.y;

    ctx.fillRect(canvasPt.x - barWidth/2, canvasPt.y, barWidth, barHeight);
  }
});
```


## Getting started

Concepts:
1. Data space vs Canvas space  
  Data space is the space that the data originally in. 
  The data will transform to Canvas space by calling c2d() in order display properly in the canvas.
  We also provide d2c() to transform data from canvas space to data space
2. Rendering vs Chart Control  
  We recommend writing your rendering and controlling code in separate files. 
  Rendering is an idempotent function that display your data only.
  You will probably write your rendering like this
  ```
  chart.on('render', (time, deltaTime) => MyRenderer.render(time, deltaTime, chart.data));
  ```

Core Classes and methods you should look at:
1. CoreChart
  - setViewPort()
  - setViewPortLimit()
  - getAxis()
  - scroll()
  - zoom()
  - on('beforeRender'), on('render'), on('postRender') hooks
  - d2c(): transform a point from data space to canvas space
  - c2d(): transform a point from canvas space to data space
2. Axis
  - d2c(): transform a value from data space to canvas space
  - c2d(): transform a value from canvas space to data space
  - ticks(): find the ticks that should be rendered

3. Animation (optional)
```
chart.startAnimation(new DurationAnimation({
  duration: options.animationDuration,
  onUpdate:(deltaTime, time, progress, deltaProgress)=>{
    // update the value here
    this.invalidate();
  }
}));
```

## Examples
see `dev-src/charts`

## Contributing

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# run unit tests while development
npm run unit-dev

# run all tests
npm test

# build
npm run build
```

Welcome PR for the bug fixes, proposal.  

We also accept Plugins and Renderer PR in current stage.

## TODO
1. write documentation
