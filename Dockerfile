FROM node:9-alpine

LABEL maintainer="Wahyudi Wibowo <wahyudi.ibo.wibowo@gmail.com>"

RUN apk update && apk add --no-cache g++ git python make

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm i -g node-gyp
RUN npm i

EXPOSE 3000

ENTRYPOINT [ "./scripts/docker/start.sh" ]
