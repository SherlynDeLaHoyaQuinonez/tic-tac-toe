FROM alpine:latest
RUN apk update && \
    apk add curl && \
    apk add bash

RUN apk add nodejs \
    && apk add npm


RUN node -v
RUN npm -v
WORKDIR /app
COPY . .
RUN npm install
RUN npm install ws
CMD [ "npm", "run","start" ]