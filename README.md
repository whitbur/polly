# Polly
Quick, secure, self-hosted polling.

## Installation
All you need to run Polly is Git and Docker/docker-compose. Run these commands:

```
git clone https://github.com/whitbur/polly
cd polly
docker-compose run --rm node yarn build
docker-compose up
```

This is insecure by default! On my setup, I've got a server-wide nginx reverse proxy that handles SSL termination. I may add that into the docker-compose file at a later date.

To run a development server on port 3000, use this command:

```
yarn start
```
