module.exports = function(config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript", "phantomjs-shim"],
    files: [
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
