const express = require('express');

const _ = require('lodash');
let app = express();
const mime = require('mime-types');

const resize = require('./modules/resize');
const storage = require('./modules/storage');
const cache = require('./modules/cache');

let sendImage = function (imagePath, res) {
    res.writeHead(200, {
        'Content-Type': mime.contentType(storage.getExtName(imagePath)),
        'Content-Length': storage.getImageSize(imagePath),
    });

    storage.getImageStream(imagePath).pipe(res);
};

let parseResizeParameters = (queryString) => {
    "use strict";
    const resizeParams = _.split(queryString, 'x');
    if (resizeParams.length !== 2 || isNaN(resizeParams[0]) || isNaN(resizeParams[1])) {
        throw new Error('Invalid size.');
    }

    return {
        width: _.parseInt(resizeParams[0]),
        height: _.parseInt(resizeParams[1])
    };
};

app.get('/image/:image', (req, res, next) => {
    let image = req.params.image;
    let imagePath = storage.buildImagePath(image);

    if (storage.imageExists(imagePath)) {
        if (!_.isEmpty(req.query.size)) {
            let resizeParameters = {};
            try {
                resizeParameters = parseResizeParameters(req.query.size);
            } catch (e) {
                return res.status(400).send(e.toString());
            }

            let processedImagePath = cache.getCached(image, resizeParameters.width, resizeParameters.height);
            if (_.isNull(processedImagePath)) {
                processedImagePath = storage.resizeImagePath(storage.buildResizedImageName(image, resizeParameters.width, resizeParameters.height));
                resize.resizeImage(imagePath, processedImagePath, resizeParameters.width, resizeParameters.height).then(
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