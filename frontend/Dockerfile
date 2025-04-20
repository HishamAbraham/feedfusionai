LABEL authors="hishamabraham"

# Stage 1: build
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# optional: copy your own nginx.conf if you have one
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]