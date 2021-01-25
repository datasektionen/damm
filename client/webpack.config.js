const path = require('path');

module.exports = {
  entry: './src/serviceworker.js',
  output: {
    filename: 'service-worker.js',
    path: path.resolve(__dirname, 'public'),
  }
};