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

CMD ["nginx", "-g", "daemon off;"]