# Image delivery microservice

Run app: `node server.js` 

Run tests: `npm run test`


## Examples
1. Get original image: 

GET http://localhost:3000/image/cat.jpg

2. Get a resized image:

GET http://localhost:3000/image/cat.jpg?size=100x100

## To do
1. Add metrics with statsd

2. Figure out the spies tests for caching. 