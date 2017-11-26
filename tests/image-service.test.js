const path = require('path');
const fs = require('fs');
const expect = require('expect');
const rewire = require('rewire');
const storage = require('./../modules/storage');

let imageService = rewire('./../modules/image-service');
let resize = require('./../modules/resize');


const storageDir = './storage/resized';
describe('GET /image', () => {
    before(() => {
        "use strict";
        fs.readdir(storageDir, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(storageDir, file), err => {
                    if (err) throw err;
                });
            }
        });
    });

    it('should not call image resize and provide full size image', () => {
        let resizeSpy = expect.spyOn(resize, 'resizeImage').andCallThrough();
        imageService.__set__('resize', resizeSpy);

        let spyCB = expect.createSpy();
        imageService.getImage('cat.jpg', {}, spyCB);

        expect(spyCB).toHaveBeenCalledWith(storage.buildImagePath('cat.jpg'), {});
        expect(resizeSpy).toNotHaveBeenCalled();
    });


    it('should return 200 and return the the resized image with no cache', (done) => {
        //@todo figure this out
        // let resizeParameters = {
        //     width: 120,
        //     height: 120
        // };
        // let processedImagePath = storage.resizeImagePath(storage.buildResizedImageName('cat.jpg', resizeParameters.width, resizeParameters.height));
        //
        // let resizeSpy = expect.spyOn(resize, 'resizeImage').andCallThrough();
        // //imageService.__set__('resize', resizeSpy);
        //
        // let spyCB = expect.createSpy();
        // imageService.getImage('cat.jpg', resizeParameters, spyCB);
        //
        // expect(spyCB).toHaveBeenCalledWith(processedImagePath, {});
        // expect(resizeSpy).toHaveBeenCalled();
        //
        done();
    });

    it('should return 200 and return the the resized image with cache', (done) => {
        //@todo figure this out
        done();
    });
});
