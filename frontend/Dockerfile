# ============================================================
# Stage 1: Builder — install deps & build Vite bundle
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for vite build)
RUN npm ci

# Copy the rest of the source
COPY . .

# Build static assets → dist/
# VITE_API_URL is passed at build time via --build-arg
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ============================================================
# Stage 2: Production — serve with Nginx
# ============================================================
FROM nginx:stable-alpine AS production

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (handles SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Nginx runs in foreground by default
CMD ["nginx", "-g", "daemon off;"]
