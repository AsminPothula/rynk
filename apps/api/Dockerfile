FROM node:18.12.1 as base

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm i --production=false

RUN chown root:root node_modules


FROM node:18.12.1 as local

WORKDIR /app

COPY --from=base /app /app/

EXPOSE 5001
EXPOSE 9229



FROM node:18.12.1-alpine3.17 as buildImage

WORKDIR /app

RUN apk --no-cache add --virtual builds-deps build-base python3 g++ make gcc curl bash && rm -rf /var/cache/apk/*
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

COPY --from=base /app /app/

COPY . .

RUN npm run build

# RUN npx tsc orm.ts

RUN rm -rf node_modules

RUN rm -rf src

RUN npm i --production

RUN npx node-prune

RUN \
  chown root:root /app/build && \
  chown root:root /app/node_modules

# RUN chown root:root /app/orm.js


FROM node:18.12.1-alpine3.17 as development

WORKDIR /app

COPY tsconfig.json .
COPY tsconfig.base.json .
COPY tsconfig.build.json .
COPY package.json .
COPY .env.vault .

COPY --from=buildImage /app/build /app/
COPY --from=buildImage /app/node_modules /app/
# COPY --from=buildImage /app/ormconfig.js /app/

RUN chown root:root /app

EXPOSE 5001
EXPOSE 9229

CMD [ "npm", "run", "start:prod" ]



FROM node:18.12.1-alpine3.17 as production

WORKDIR /app

COPY --from=development /app /app

EXPOSE 5001
EXPOSE 9229

CMD [ "npm", "run", "start:prod" ]
