let express = require('express');

let _ = require('lodash');
let app = express();
let path = require('path');
let fs = require('fs');
let mime = require('mime-types');
let jimp = require('jimp');

let sendImage = function (imagePath, res) {
    let stat = fs.statSync(imagePath);

    res.writeHead(200, {
        'Content-Type': mime.contentType(path.extname(imagePath)),
        'Content-Length': stat.size,
    });

    let readStream = fs.createReadStream(imagePath);
    readStream.pipe(res);
};

let buildResizedImageName = (imageName, witdh, height) => {
    "use strict";
    return `${witdh}x${height}_${imageName}`;
};

let buildImagePath = function (imageName) {
    "use strict";
    return path.join(__dirname, 'storage', imageName);
};

let resizeImagePath = (imageName) => {
    "use strict";
    return path.join(__dirname, 'storage', 'resized', imageName);
};

let resizeImage = (inputPath, outputPath, witdh, height) => {
    "use strict";
    jimp.read(inputPath, function (err, image) {
        if (err) {
            console.log(err);
            throw err;
        }
        image.resize(witdh, height)
            .write(outputPath);

        return outputPath;
    });
};


app.get('/image/:image', (req, res) => {
    let image = req.params.image;
    let imagePath = buildImagePath(image);

    if (fs.existsSync(imagePath)) {
        if (!_.isEmpty(req.query.size)) {
            let resizeParams = _.split(req.query.size, 'x');
            if (resizeParams.length !== 2) {
                return res.status(400).send();
            }

            let width = _.parseInt(resizeParams[0]);
            let height = _.parseInt(resizeParams[1]);

            let cachedImagePath = resizeImagePath(buildResizedImageName(image, width, height));
            if (!fs.existsSync(cachedImagePath)) {
                try {
                    imagePath = resizeImage(imagePath, cachedImagePath, width, height);
                } catch (e) {
                    res.status(500).send();
                }

            }
        }
        return sendImage(imagePath, res);
    }

    res.status(404).send();
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};