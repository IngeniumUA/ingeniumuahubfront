FROM node:20-alpine AS build
ARG ENVIRONMENT=production

WORKDIR /source
COPY . .
RUN npm ci && npm run build -- --mode $ENVIRONMENT && rm -rf node_modules && npm ci --omit=dev

FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runtime

WORKDIR /app
COPY --from=build /source/build ./build
COPY --from=build /source/node_modules ./node_modules
COPY --from=build /source/package.json ./package.json
CMD ["build/index.js"]