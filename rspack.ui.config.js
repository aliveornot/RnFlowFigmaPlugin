/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  entry: './src/ui/entry.tsx',

  devtool: false,
  optimization: {
    minimize: false,
  },
  output: {
    path: __dirname + '/temp',
    filename: 'uiAppEntry.js',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', 'js'],
  },
  module: {
    rules: [
      {
        test: /\.(png)$/,
        type: 'asset/inline',
      },
    ],
  },
};
