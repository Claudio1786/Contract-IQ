# Multi-stage build for Contract IQ
# Stage 1: Build the Next.js frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY apps/web/package*.json ./apps/web/
COPY package*.json ./

# Install dependencies
RUN npm ci --prefix ./apps/web

# Copy frontend source
COPY apps/web ./apps/web

# Build frontend
WORKDIR /app/apps/web
RUN npm run build

# Stage 2: Build Python backend
FROM python:3.11-slim AS backend-builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements
COPY apps/api/requirements.txt ./apps/api/

# Install Python dependencies
RUN pip install --no-cache-dir -r apps/api/requirements.txt

# Copy backend source
COPY apps/api ./apps/api

# Stage 3: Production image
FROM python:3.11-slim AS production

WORKDIR /app

# Install Node.js for serving frontend
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy Python dependencies
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin

# Copy backend application
COPY --from=backend-builder /app/apps/api ./apps/api

# Copy built frontend
COPY --from=frontend-builder /app/apps/web/.next ./apps/web/.next
COPY --from=frontend-builder /app/apps/web/public ./apps/web/public
COPY --from=frontend-builder /app/apps/web/package*.json ./apps/web/
COPY --from=frontend-builder /app/apps/web/next.config.ts ./apps/web/

# Install production frontend dependencies
RUN cd apps/web && npm ci --production

# Create startup script
RUN echo '#!/bin/bash\n\
# Start FastAPI backend in background\n\
cd /app/apps/api && python -m uvicorn contract_iq.main:app --host 0.0.0.0 --port 8000 &\n\
\n\
# Start Next.js frontend\n\
cd /app/apps/web && npm start -- --port 3000\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start application
CMD ["/app/start.sh"]