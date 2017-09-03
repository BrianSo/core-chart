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
    reporters: ["spec", "karma-typescript"],
    browsers: ["PhantomJS"],
    karmaTypescriptConfig:{
      reports:{
        html:"./coverage",
        "text-summary":""
      }
    }
  });
};
