FROM node:20-alpine AS build
ARG ENVIRONMENT=production

# Copying of ENV is not required as Vite will use the correct one automatically

WORKDIR /source
COPY . .
RUN npm ci && npm run build -- --mode $ENVIRONMENT

FROM gcr.io/distroless/nodejs20-debian12 AS runtime

WORKDIR /app
COPY --from=build /source/build ./build
COPY --from=build /source/package.json .
RUN npm install --omit=dev
CMD ["node", "build"]