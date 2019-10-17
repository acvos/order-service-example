# Order Service
Coding challenge for EA

## API

| URL | Method | Purpose |
| --- | --- | --- |
| /health | GET | Health check |
| /coffee-shops | GET | List all coffee shops |
| /coffee-shops | POST | Register a coffee shop |
| /coffee-shops/:id | GET | View coffee shop by id |
| /coffee-shops/:id | PATCH | Modify coffee shop's details |
| /coffee-shops/:id | DELETE | Delete coffee shop |
| /coffee-shops/:shopId/orders | GET | List all orders for a given coffee shop |
| /coffee-shops/:shopId/orders | POST | Place an order with a coffee shop |
| /coffee-shops/:shopId/orders/:id | GET | Review order's details |
| /coffee-shops/:shopId/orders/:id | PATCH | Modify order's details |
| /coffee-shops/:shopId/orders/:id | DELETE | Close order |

## Design Notes
### Persistance

We used `refdata-storage` package [https://github.com/TICitHub/storage] running in default mode as our persistance layer since the requirements expected all the data to be stored in memory. However, given provided proper ChangeLog and SearchIndex adapters, `refdata-storage` can be used no top of Kafka & Elasticsearch or filesystem or git-backed filesystem which would allow us to add scalable database layer to the application without re-writing its code.

### Ports and Adapters

The application is written following ports and adapters (hexagonal) architecture and dependency injection patterns. The business logic (`app` folder) should be kept free from IO concerns which are isolate in adapters. Since the web-server itself is an IO concern it is also isolated in its own adapter. This allows us to easily switch to other modes of communication with the app in the future without the need to touch any application code, e.g. use some binary RPC protocol instead of HTTP, use it as a CLI tool, connect the app as a worker to a message queue or simply include it as a plugin in a bigger system.

## Pre-requisites and Setup

1. Make sure you have node and npm installed
2. Clone the repository, go inside the repository folder

## Automated testing

Due to the lack of time, the test automation currently only covers App's business logic. IO adapters should be covered as well.

1. run `npm i`
2. run `npm test`

## Development mode

1. Copy .env.example file to .env, modify content if needed
2. run `npm i`
3. run `npm run dev`
4. The service should start listening on the port you specified in .env file (3201 by default)
5. Open `http://localhost:<YOUR PORT>/health` in the browser to check the server's health

## Release mode on local machine

1. run `docker-compose up`
2. The service should start listening on the port you specified in .env file (3201 by default)
3. Open `http://localhost:<YOUR PORT>/health` in the browser to check the server's health

## Building docker image for production release

1. Build a versioned docker image:
  `docker build . -t order-service:<version number>`
2. Save docker image into a file if necessary:
  `docker save order-service:<version number> | gzip > order-service:<version number>.tar.gz`

Note: failing automated tests will break the build
