FROM node:20-alpine

WORKDIR /app

# Set production environment and disable output buffering
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--no-warnings"

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_CYPHER_KEY

ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_CYPHER_KEY=$NEXT_PUBLIC_CYPHER_KEY

# Build with logging
RUN echo "[$(date -Iseconds)] Starting Next.js build..." && \
    npm run build && \
    echo "[$(date -Iseconds)] Build completed successfully"

EXPOSE 3000

# Start with logging
CMD echo "[$(date -Iseconds)] Starting Next.js server on port ${PORT:-3000}..." && npm start
