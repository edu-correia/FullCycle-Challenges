# Challenge #2 - Nginx Reverse Proxy on Node Server
### Chapter 1 - Docker

<br>

## :clipboard: Challenge:
For this challenge, we should make a NodeJS Web Server that communicates with a MySQL Database, inserting and listing items from the "People" table. \
This Node server must have a Nginx Reverse Proxy Server redirecting all calls from port 8080 to the Node Server. \
All of this should be deployed using Docker Compose.

Rules:
- We can't have NodeJS tools installed locally in our machines, all Node and NPM operations should be dealt inside the container.

<br>

## :arrow_forward: How to run it:
As explained before, this whole project shoudl only using Docker Compose, so to run it you only need to execute the following command: \
`docker-compose up -d`

After running, you can use one of these 2 REST API endpoints:
**Endpoint**    | **Functionality**
----------------|---------------
localhost:8080/ | Get all users
localhost:8080/:name | Insert new user with `:name` param

