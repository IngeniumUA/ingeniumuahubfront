FROM node:16.14.0 as build
ARG _API_ARG
WORKDIR /source

# Copy the package lock file into the container
COPY package*.json ./
# Run ci only for the production dependencies
RUN npm ci

# Copy the rest of the files into the container and build
COPY . .

RUN npm run build --configuration $_API_ARG

FROM nginx:alpine
COPY --from=build /source/dist/ingeniumuahubfront /usr/share/nginx/html
COPY --from=build /source/nginx.conf /etc/nginx/conf.d/
EXPOSE 8080
