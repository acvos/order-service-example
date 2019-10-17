FROM node:10.13.0-alpine AS build

WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN npm test && npm run build

FROM build AS release

COPY package*.json .
COPY dist .
RUN npm install --only=production

ENV SERVICE_NAME order-service
ENV DEBUG 0
ENV PORT 80

CMD [ "npm", "start" ]
