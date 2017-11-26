let jimp = require('jimp');
let fs = require('fs');

let resizeImage = (inputPath, outputPath, witdh, height) => {
    return new Promise((resolve, reject) => {
        jimp.read(inputPath, function (err, image) {
            if (err) {
                reject(err);
            }
            // image.resize(witdh, height)
            //     .write(outputPath, (obj) => {
            //         console.log(obj);
            //         resolve(outputPath);
            //     });

            image.resize(witdh, height).getBuffer(jimp.AUTO, (err, buffer) => {
                fs.writeFile(outputPath, buffer, (err) => {
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