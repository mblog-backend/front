FROM node:18-alpine as build-stage

ARG VERSION
WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock ./
RUN --mount=type=cache,id=yarn-store,target=/root/.yarn-store \
    yarn install --registry=https://registry.npm.taobao.org

COPY . .
RUN sed -i 's#REPLACE_VERSION_HERE#'"$VERSION"'#g'  /app/.env.docker`

RUN yarn build-only --mode=docker

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf

COPY entrypoint.sh /usr/share/nginx

EXPOSE 80

RUN chmod +x /usr/share/nginx/entrypoint.sh

CMD /usr/share/nginx/entrypoint.sh