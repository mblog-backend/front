FROM node:18-alpine as build-stage

WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock ./
RUN --mount=type=cache,id=yarn-store,target=/root/.yarn-store \
    yarn install --registry=https://registry.npm.taobao.org

COPY . .
RUN yarn build-only --mode=docker

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY entrypoint.sh /usr/share/nginx

EXPOSE 80

RUN chmod +x /usr/share/nginx/entrypoint.sh

CMD /usr/share/nginx/entrypoint.sh