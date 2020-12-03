FROM node:latest AS builder

WORKDIR /usr/src/app
COPY . ./
RUN yarn install
RUN yarn build

FROM node:latest

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY --from=builder /usr/src/app/build ./build/

HEALTHCHECK CMD curl -f http://localhost:3000/status || exit 1
EXPOSE 3000

CMD yarn start