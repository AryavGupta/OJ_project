FROM node:22-alpine
WORKDIR /app
RUN apk update && apk add --no-cache \
    g++ \
    python3 \
    openjdk17 \
    coreutils \
    && ln -sf python3 /usr/bin/python
COPY . .  
RUN npm install
EXPOSE 5001
CMD [ "node", "index.js" ]