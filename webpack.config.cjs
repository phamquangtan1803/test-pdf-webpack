// const path = require("path");
// const webpack = require("webpack");

// module.exports = {
//   entry: path.resolve(__dirname, "src/pdfSource/index.js"),

//   plugins: [
//     // new HtmlWebpackPlugin({
//     //   template: path.resolve(__dirname, "src/index.html"),
//     // }),
//     new webpack.ProvidePlugin({
//       Buffer: ["buffer", "Buffer"],
//       process: "process/browser",
//     }),
//   ],
//   resolve: {
//     symlinks: false,
//     alias: {
//       // maps fs to a virtual one allowing to register file content dynamically
//       fs: __dirname + "/../../js/virtual-fs.js",
//     },
//     fallback: {
//       // crypto module is not necessary at browser
//       crypto: false,
//       // fallbacks for native node libraries
//       buffer: require.resolve("buffer/"),
//       //   stream: require.resolve("readable-stream"),
//       zlib: require.resolve("browserify-zlib"),
//       util: require.resolve("util/"),
//       assert: require.resolve("assert/"),
//       stream: require.resolve("readable-stream"),
//     },
//   },
//   module: {
//     rules: [
//       // bundle and load afm files verbatim
//       { test: /\.afm$/, type: "asset/source" },
//       // bundle and load binary files inside static-assets folder as base64
//       {
//         test: /src[/\\]static-assets/,
//         type: "asset/inline",
//         generator: {
//           dataUrl: (content) => {
//             return content.toString("base64");
//           },
//         },
//       },
//       // load binary files inside lazy-assets folder as an URL
//       {
//         test: /src[/\\]lazy-assets/,
//         type: "asset/resource",
//       },
//     ],
//   },
// };
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

console.log("__dirname:", __dirname);
console.log("process:", process.cwd());
console.log(
  "Resolved entry path:",
  path.resolve(__dirname, "src/pdfSource/index.js")
);
module.exports = {
  entry: path.resolve(__dirname, "src/pdfSource/index.js"), // Ensure this path is correct

  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ],
  resolve: {
    symlinks: false,
    alias: {
      // maps fs to a virtual one allowing to register file content dynamically
      fs: __dirname + "/src/pdfSource/utils/virtual-fs.js",
    },
    fallback: {
      // crypto module is not necessary at browser
      crypto: false,
      // fallbacks for native node libraries
      buffer: require.resolve("buffer/"),
      stream: require.resolve("readable-stream"),
      zlib: require.resolve("browserify-zlib"),
      util: require.resolve("util/"),
      assert: require.resolve("assert/"),
      process: require.resolve("process/browser"),
    },
  },
  module: {
    rules: [
      // bundle and load afm files verbatim
      { test: /\.afm$/, type: "asset/source" },
      // bundle and load binary files inside static-assets folder as base64
      {
        test: /src[/\\]static-assets/,
        type: "asset/inline",
        generator: {
          dataUrl: (content) => {
            return content.toString("base64");
          },
        },
      },
      // load binary files inside lazy-assets folder as an URL
      {
        test: /src[/\\]lazy-assets/,
        type: "asset/resource",
      },
    ],
  },
};
