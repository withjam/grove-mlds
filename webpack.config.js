const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

var PATHS = {
  entryPoint: path.resolve(__dirname, "src/index.ts"),
  bundles: path.resolve(__dirname, "dist/_bundles")
};

module.exports = {
  entry: {
    "grove-mlds-client": [PATHS.entryPoint],
    "grove-mlds-client.min": [PATHS.entryPoint]
  },
  // The output defines how and where we want the bundles. The special
  // value `[name]` in `filename` tell Webpack to use the name we defined above.
  // We target a UMD and name it MyLib. When including the bundle in the browser
  // it will be accessible at `window.MyLib`
  output: {
    path: PATHS.bundles,
    filename: "[name].js",
    libraryTarget: "umd",
    library: "GroveMLDS",
    umdNamedDefine: true
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};
