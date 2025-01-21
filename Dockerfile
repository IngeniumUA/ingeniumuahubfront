FROM node:18-alpine AS build
ARG CONFIGURATION
WORKDIR /source
COPY . .
RUN npm ci
RUN npm run build -- --configuration ${CONFIGURATION}

FROM node:18-alpine

WORKDIR /app
COPY --from=build /source/dist /app/dist

CMD ["node", "/app/dist/ingeniumuahubfront/server/server.mjs"]
