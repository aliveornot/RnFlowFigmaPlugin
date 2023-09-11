/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  entry: './src/index.ts',
  target: 'web',

  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', 'js'],
  },
};
