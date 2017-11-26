const express = require('express');
const _ = require('lodash');
const mime = require('mime-types');
const storage = require('./modules/storage');
const imageService = require('./modules/image-service');

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
    const image = req.params.image;
    let resizeParameters = {};
    try {
        resizeParameters = parseResizeParameters(req.query.size);
    } catch (e) {
        return res.status(400).send();
    }

    imageService.getImage(image, resizeParameters, (imagePath, error) => {
        "use strict";
        if (_.isEmpty(error)) {
            return sendImage(imagePath, res);
        } else {
            return res.status(error.statusCode).send();
        }
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};