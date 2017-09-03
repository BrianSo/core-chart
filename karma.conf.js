module.exports = function(config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    files: [
      { pattern: "./node_modules/es6-object-assign/dist/object-assign-auto.js"},
      { pattern: "src/**/*.ts" }, // *.tsx for React Jsx
    ],
    preprocessors: {
      "src/**/*.ts": ["karma-typescript"], // *.tsx for React Jsx
    },
    reporters: ["progress", "karma-typescript"],
    browsers: ["PhantomJS"]
  });
};
