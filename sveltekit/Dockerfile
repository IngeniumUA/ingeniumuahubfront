FROM node:20-alpine AS build
ARG ENVIRONMENT=production

# Copying of ENV is not required as Vite will use the correct one automatically

WORKDIR /source
COPY . .
RUN npm ci && npm run build -- --mode $ENVIRONMENT

FROM node:20-alpine AS runtime

WORKDIR /app
COPY --from=build /source/build ./build
COPY --from=build /source/package.json .
CMD ["node", "build"]