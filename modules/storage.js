let path = require('path');
let fs = require('fs');

const basePath = path.resolve(__dirname, '..', 'storage');

let buildImagePath = function (imageName) {
    return path.join(basePath, imageName);
};

let buildResizedImageName = (imageName, witdh, height) => {
    return `${witdh}x${height}_${imageName}`;
};

let resizeImagePath = (imageName) => {
    return path.join(basePath, 'resized', imageName);
};

let imageExists = (path) => {
    return fs.existsSync(path);
};

module.exports = {
    buildImagePath,
    resizeImagePath,
    imageExists,
    buildResizedImageName
};