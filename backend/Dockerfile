# ============================================================
# Stage 1: Builder — compile TypeScript
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools needed for native modules (sqlite3)
RUN apk add --no-cache python3 make g++

# Copy dependency manifests first (layer-cache friendly)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for tsc)
RUN npm ci

# Copy source code
COPY . .

# Compile TypeScript → dist/
RUN npm run build

# ============================================================
# Stage 2: Production — lean runtime image
# ============================================================
FROM node:20-alpine AS production

WORKDIR /app

# Install runtime build tools for native modules (sqlite3 needs them at install)
RUN apk add --no-cache python3 make g++

# Copy only production dependency manifests
COPY package*.json ./

# Install production dependencies only (re-builds native modules for this arch)
RUN npm ci --omit=dev

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Create the data directory for SQLite persistence
RUN mkdir -p /data && chown node:node /data

# Use non-root user for security
USER node

# Expose backend port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

# Start the compiled server
CMD ["node", "dist/server.js"]
