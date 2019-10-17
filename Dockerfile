FROM node:10.13.0-alpine AS base

# Testing and compiling Typescript
FROM base AS build

RUN apk --no-cache add python make g++

WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN npm test
RUN npm run build

RUN rm -rf node_modules
RUN npm install --only=production

# Preparing release image
FROM base AS release

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=build /usr/src/app/dist .
COPY --from=build /usr/src/app/node_modules .

ENV SERVICE_NAME order-service
ENV DEBUG 0
ENV PORT 80

CMD [ "npm", "start" ]
