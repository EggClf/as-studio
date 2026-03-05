# Stage 1: Build with official Node.js image
FROM node:22-slim AS builder

WORKDIR /app

# Copy only package files first (for better caching)
COPY package.json package-lock.json ./
COPY packages/client/package.json ./packages/client/
COPY packages/server/package.json ./packages/server/

# Install dependencies with cache mount (survives across builds)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source code per-package so changing client doesn't invalidate server cache
COPY packages/server/ ./packages/server/
COPY packages/shared/ ./packages/shared/
COPY packages/app/ ./packages/app/
COPY bin/ ./bin/
COPY packages/client/ ./packages/client/

# Build the application
RUN npm run build

# Reinstall production dependencies only
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Stage 2: Runtime with Python + Node.js
FROM python:3.10-slim

ARG DEBIAN_FRONTEND=noninteractive

# Install essential tools (without Node.js - will copy from builder)
RUN apt-get update && apt-get install -y --fix-missing \
    curl ca-certificates build-essential git sqlite3 \
    && pip install --no-cache-dir --upgrade pip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Node.js from builder stage (no need to download again)
COPY --from=builder /usr/local/bin/node /usr/local/bin/node
COPY --from=builder /usr/local/lib/node_modules /usr/local/lib/node_modules

WORKDIR /app

# Install Python deps BEFORE copying dist (rarely changes, avoids re-install on client edits)
COPY packages/app/requirements.txt /tmp/requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r /tmp/requirements.txt \
    && rm /tmp/requirements.txt

# Copy built artifacts from builder (changes on every client edit — keep last)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Runtime environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    OTEL_GRPC_PORT=4317 \
    HOME=/app/data \
    LOG_LEVEL=warn \
    PYTHONUNBUFFERED=1

EXPOSE 3000 4317

ENTRYPOINT ["/entrypoint.sh"]
