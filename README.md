# core-chart-js (alpha stage)

[![Build Status](https://travis-ci.org/BrianSo/core-chart.svg?branch=master)](https://travis-ci.org/BrianSo/core-chart)

This is a minimal library for creating highly customized chart. No rendering is included. Write the rendering by your self. Write the animation by your self.

What it is included:  
1. View port (zooming and scrolling)
2. Conversion from data point to canvas position.

Concepts:  
1. Data space: the raw value of the data
2. Canvas space: the projection result
3. d2c, c2d: the conversion from data space to canvas space and vice versa.

## APIs
### CoreChart
The chart controller.

### Axis
The axis of the chart. 

### Examples
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
```

## TODO
1. write documentation
