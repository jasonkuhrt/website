import Path from "path"
import "babel-polyfill"



const path = Path.join.bind(null, __dirname)
const outputDirName = "build"
const outputDir = path(outputDirName)

export default {
  entry: [ "babel-polyfill", "./src/main" ],
  output: {
    path: outputDir,
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ["babel"]},
      { test: /\.css$/, exclude: /node_modules/, loaders: ["style", "css"]},
      { test: /.*\/assets\/permalinked\/.*/, exclude: /node_modules/, loaders: ["file?name=[name].[ext]"]},
    ]
  },
  devServer: {
    contentBase: outputDir
  },
}
