const path = require('path');

function getImageData(props, devicePixelRatio = 1) {
  return {
    height: props.height || props.dimensions && props.dimensions.height,
    path: props.path,
    devicePixelRatio,
    relativePath: (props.path) ? path.relative(process.cwd(), props.path) : '',
    width: props.width || props.dimensions && props.dimensions.width,
  };
}

module.exports = getImageData;
