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

# Install gettext for envsubst
RUN apk add --no-cache gettext

WORKDIR /app

# Copy built files and necessary assets from the builder stage
COPY --from=builder /build/dist /usr/share/nginx/html

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose the port the app runs on
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]