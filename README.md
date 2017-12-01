# Image delivery microservice

Run with docker: `docker-compose up`

Run tests: `npm run test` (inside the service docker container)

## URLs
1. Image delivery service: http://localhost:3000

⋅⋅* /image

..* /stats

2. Graphite dashboard: http://localhost:5000/dashboard


## Examples
1. Get original image: 

GET http://localhost:3000/image/cat.jpg

2. Get a resized image:

GET http://localhost:3000/image/cat.jpg?size=100x100

3. Get image stats

GET http://localhost:3000/stats


## Monitoring

Namespace: **stats_counts.image_delivery**:
1. resize_success 
2. resize_error
3. image_not_found
4. cache_hit
5. cache_miss
6. invalid_image
7. image_not_retrieved

## To do
1. Figure out the spies tests for caching. 
