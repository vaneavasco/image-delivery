const express = require('express');
const config = require('./config');
const _ = require('lodash');
const mime = require('mime-types');
const storage = require('./modules/storage');
const imageService = require('./modules/image-service');
const metrics = require('./modules/metrics');

let app = express();

let sendImage = function (imagePath, res) {
    res.writeHead(200, {
        'Content-Type': mime.contentType(storage.getExtName(imagePath)),
        'Content-Length': storage.getImageSize(imagePath),
    });

    storage.getImageStream(imagePath).pipe(res);
};

let parseResizeParameters = (queryString) => {
    "use strict";
    if (_.isEmpty(queryString)) {
        return {};
    }

    const resizeParams = _.split(queryString, 'x');
    if (resizeParams.length !== 2 || isNaN(resizeParams[0]) || isNaN(resizeParams[1])) {
        throw new Error('Invalid size.');
    }

    return {
        width: _.parseInt(resizeParams[0]),
        height: _.parseInt(resizeParams[1])
    };
};

app.get('/image/:image', (req, res) => {
    let image = req.params.image;
    image = storage.cleanImageName(image);
    if (_.isEmpty(image)) {
        metrics.increment('image_delivery.invalid_image');
        res.status(404).send();
    }

    let resizeParameters = {};
    try {
        resizeParameters = parseResizeParameters(req.query.size);
    } catch (e) {
        metrics.increment('image_delivery.error');
        return res.status(400).send();
    }

    imageService.getImage(image, resizeParameters, (imagePath, error) => {
        "use strict";
        if (_.isEmpty(error)) {
            metrics.increment('image_delivery.success');
            return sendImage(imagePath, res);
        } else {
            metrics.increment('image_delivery.image_not_retrieved');
            return res.status(error.statusCode).send();
        }
    });
});

app.get('/stats', (req, res) => {
    let stats = {
        'original': storage.countOriginalImages(),
        'resized': storage.countResizedImages()
    };
    res.send(stats);
});

app.listen(config.server.port, () => {
    console.log('Started on port: ', config.server.port);
});

module.exports = {app};