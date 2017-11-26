let jimp = require('jimp');
let storage = require('./storage');

let resizeImage = (inputPath, outputPath, witdh, height) => {
    return new Promise((resolve, reject) => {
        jimp.read(inputPath, function (err, image) {
            if (err) {
                reject(err);
            }

            image.resize(witdh, height).getBuffer(jimp.AUTO, (err, buffer) => {
                storage.saveImage(outputPath, buffer, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(outputPath);
                });
            });
        });
    });
};

module.exports.resizeImage = resizeImage;