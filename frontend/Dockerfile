# Stage 1: build
FROM node:16-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Inject the correct API base URL at build time
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
