# Only build stage prod with --target
docker build -t multistage --target prod .
docker build -t multistage --target prod . && docker run multistage

# build dev environment
docker build -t multistage:dev --target dev . \
    && docker run --init -p 3000:3000 multistage:dev

docker build -t multistage:test --target test . \
    && docker run --init multistage:test