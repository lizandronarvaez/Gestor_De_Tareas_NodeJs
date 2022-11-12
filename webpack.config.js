import path from "path";
const rulesForJavaScript = { test: /\.js$/, use: { loader: "babel-loader", options: { presets: ["@babel/preset-env"] } } }
// 
export default {
  entry: "./src/public/js/app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve('./src/public/dist'),
  },
  module: {
    rules: [rulesForJavaScript],
  },
};
