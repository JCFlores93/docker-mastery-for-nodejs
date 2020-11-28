FROM node:8-slim as base

# labels from https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL org.opencontainers.image.authors=github@JCFlores93.com
LABEL org.opencontainers.image.title="Node.js Ultimate Dockerfile"
LABEL org.opencontainers.image.licenses=MIT
LABEL com.JCFlores93.nodeversion=$NODE_VERSION

ENV NODE_ENV=production
EXPOSE 80
WORKDIR /app
COPY package*.json ./
# we use npm ci here so only the package-lock.json file is used
RUN npm config list
RUN npm ci \
    && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH
ENV TINI_VERSION v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
CMD ["node", "server.js"]

# environment dev
FROM base as dev
ENV NODE_ENV=development
RUN apt-get update -qq && apt-get install -qy \ 
    ca-certificates \
    bzip2 \
    curl \
    libfontconfig \
    --no-install-recommends
RUN echo $PATH
RUN npm config list
RUN npm install --only=development \
    && npm cache clean --force
# USER node
CMD ["node", "server.js"]
# CMD ["nodemon", "server.js"]


FROM dev as test
COPY . .
# RUN npm audit
# ARG MICROSCANNER_TOKEN
# ADD https://get.aquasec.com/microscanner /
# USER root
# RUN chmod +x /microscanner
# RUN /microscanner $MICROSCANNER_TOKEN --continue-on-failure

FROM test as pre-prod
RUN rm -rf ./tests && rm -rf ./node_modules

FROM base as prod
COPY --from=pre-prod /app /app
HEALTHCHECK CMD curl http://127.0.0.1/ || exit 1
# USER node