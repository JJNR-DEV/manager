import '@craco/craco';
import path from 'path';

console.log(path.resolve(__dirname, '/styles'))

module.exports = {
  style: {
    sassLoader: {
      includePaths: [path.resolve(__dirname, 'styles')]
    }
  }
}
