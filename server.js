const express = require('express');

const _ = require('lodash');
let app = express();
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const resize = require('./modules/resize');
const storage = require('./modules/storage');
const cache = require('./modules/cache');

let sendImage = function (imagePath, res) {
    let stat = fs.statSync(imagePath);

    res.writeHead(200, {
        'Content-Type': mime.contentType(path.extname(imagePath)),
        'Content-Length': stat.size,
    });

    let readStream = fs.createReadStream(imagePath);
    readStream.pipe(res);
};

app.get('/image/:image', (req, res, next) => {
    let image = req.params.image;
    let imagePath = storage.buildImagePath(image);

    if (storage.imageExists(imagePath)) {
        if (!_.isEmpty(req.query.size)) {
            const resizeParams = _.split(req.query.size, 'x');
            if (resizeParams.length !== 2) {
                return res.status(400).send();
            }

            let width = _.parseInt(resizeParams[0]);
            let height = _.parseInt(resizeParams[1]);

            let processedImagePath = cache.getCached(image, width, height);
            if (_.isNull(processedImagePath)) {
                processedImagePath = storage.resizeImagePath(storage.buildResizedImageName(image, width, height));
                resize.resizeImage(imagePath, processedImagePath, width, height).then(
                    (imagePath) => {
                        return sendImage(imagePath, res);

                    }, (error) => {
                        res.status(500).send();
                    });
            } else {
                sendImage(processedImagePath, res);
            }
        } else {
            return sendImage(imagePath, res);
        }

    } else {
        res.status(404).send();
    }
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};