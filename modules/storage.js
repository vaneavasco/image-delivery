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

let imageExists = (imagePath) => {
    return fs.existsSync(imagePath);
};

let getImageSize = (imagePath) => {
    "use strict";
    let stat = fs.statSync(imagePath);

    return stat.size;
};

let getImageStream = (imagePath) => {
    "use strict";
    return fs.createReadStream(imagePath);
};

let getExtName = (imagePath) => {
    "use strict";
    return path.extname(imagePath);
};

let saveImage = (imagePath, contents, callback) => {
    "use strict";
    return fs.writeFile(imagePath, contents, callback);
};

let cleanImageName = (imageName) => {
    return path.basename(imageName);
};

let countImages = (path) => {
    let files = fs.readdirSync(path);

    return files.length;
};

let countOriginalImages = () => {
    return countImages(basePath) - 1;
};

let countResizedImages = () => {
    return countImages(path.join(basePath, 'resized'));

};

module.exports = {
    buildImagePath,
    resizeImagePath,
    imageExists,
    buildResizedImageName,
    getImageSize,
    getImageStream,
    getExtName,
    saveImage,
    cleanImageName,
    countOriginalImages,
    countResizedImages
};