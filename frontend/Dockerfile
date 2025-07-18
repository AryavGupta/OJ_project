# Build stage
FROM node:22-alpine as build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Accept build arguments and set as environment variables
ARG VITE_API_URL
ARG VITE_COMPILER_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_COMPILER_URL=${VITE_COMPILER_URL}

# Build the app with environment variables
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]