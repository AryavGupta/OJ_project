# Build stage
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stag
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for React Router (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]