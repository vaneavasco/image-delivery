const storage = require('./storage');

let getCached = (imageName, width, height) => {
    let cachedImagePath = storage.resizeImagePath(storage.buildResizedImageName(imageName, width, height));

    if(storage.imageExists(cachedImagePath)) {
        return cachedImagePath;
    }
    return null;
};

module.exports.getCached = getCached;