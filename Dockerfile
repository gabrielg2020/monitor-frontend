FROM node:22-alpine AS builder
LABEL author="gabriel"

WORKDIR /build

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

WORKDIR /app

# Copy built files and necessary assets from the builder stage
COPY --from=builder /build/dist /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '${API_ADDRESS} ${API_PORT} ${API_VERSION}' < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.tmp.js && mv /usr/share/nginx/html/config.tmp.js /usr/share/nginx/html/config.js && nginx -g 'daemon off;'"]