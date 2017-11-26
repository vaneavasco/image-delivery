# Image delivery microservice

Run app: node server.js 

Run tests: npm run test


##Examples
1. Get original image: 

GET http://localhost:3000/image/cat.jpg

2. Get a resized image:

GET http://localhost:3000/image/cat.jpg?size=100x100

##To do
1. Add metrics with statsd

2. Find a mocking library and write tests with mocked modules and spies,
currently without spies there is no way to know if the image was reprocessed or retrieved 
from cache. 


