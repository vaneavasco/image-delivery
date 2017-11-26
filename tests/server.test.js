const expect  =require('expect');
const request = require('supertest');
const fs = require('fs');
const path = require('path');

const {app} = require('./../server');
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

    it('should return a 404 status code', function(done) {
        request(app)
            .get('/image/someimage.jpg')
            .expect(404, done);
    });

    it('should return a 400 status code for invalid size params count', (done) => {
        "use strict";
        request(app)
            .get('/image/cat.jpg?size=1')
            .expect(400, done);
    });

    it('should return a 400 status code for invalid size params types', (done) => {
        "use strict";
        request(app)
            .get('/image/cat.jpg?size=qwexty')
            .expect(400, done);
    });

    it('should return 200 and return the non resized image', (done) => {
        "use strict";
        request(app)
            .get('/image/cat.jpg')
            .expect('Content-Type', 'image/jpeg')
            .expect('Content-Length', "33620")
            .expect(200, done);
    });

    it('should return 200 and return the the resized image with no cache', (done) => {
        "use strict";
        request(app)
            .get('/image/cat.jpg?size=100x100')
            .expect('Content-Type', 'image/jpeg')
            .expect('Content-Length', "15455")
            .expect(200, done);
    });


    it('should return 200 and return the the resized image with cached image', (done) => {
        "use strict";
        request(app)
            .get('/image/cat.jpg?size=100x100')
            .expect('Content-Type', 'image/jpeg')
            .expect('Content-Length', "15455")
            .expect(200, done);
    });
});