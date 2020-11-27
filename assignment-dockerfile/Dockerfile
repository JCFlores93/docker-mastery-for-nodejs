# fill in the blanks to dockerize this node app
FROM node:10.15.3-alpine

EXPOSE 3000

RUN apk add --no-cache tini

WORKDIR /app

COPY package.json package-lock*.json ./

RUN chown -R node:node .

USER node

RUN npm install && npm cache clean --force

COPY --chown=node:node . .

# ENTRYPOINT ["/sbin/tini", "--"]
ENTRYPOINT ["tini", "--"]

CMD ["node", "app.js"]