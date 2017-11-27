const _ = require('lodash');
const resize = require('./resize');
const storage = require('./storage');
const cache = require('./cache');

let getImage = (image, resizeParameters, cb) => {
    let imagePath = storage.buildImagePath(image);
    if (!storage.imageExists(imagePath)) {
        return cb(imagePath, {statusCode: 404});
    }

    if (_.isEmpty(resizeParameters)) {
        return cb(imagePath, {});
    }

    let processedImagePath = cache.getCached(image, resizeParameters.width, resizeParameters.height);
    if (_.isNull(processedImagePath)) {
        processedImagePath = storage.resizeImagePath(storage.buildResizedImageName(image, resizeParameters.width, resizeParameters.height));
        resize.resizeImage(imagePath, processedImagePath, resizeParameters.width, resizeParameters.height).then(
            (imagePath) => {
                return cb(imagePath, {});

            }, (error) => {
                return cb(imagePath, {statusCode: 500});
            });
    } else {
        return cb(processedImagePath, {});
    }
};

module.exports = {
    getImage
};