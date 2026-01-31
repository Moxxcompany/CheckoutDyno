FROM node:20-alpine

WORKDIR /app

# Force unbuffered output for Node.js
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--no-warnings"
ENV PYTHONUNBUFFERED=1
ENV NODE_NO_WARNINGS=1
ENV FORCE_COLOR=1

# Copy package files first for better caching
COPY package*.json ./
COPY yarn.lock* ./

RUN npm install --legacy-peer-deps

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
RUN echo "[BUILD] Starting Next.js build..." && \
    npm run build && \
    echo "[BUILD] Build completed successfully"

EXPOSE 3000

# Use node directly with explicit stdout flushing
CMD ["node", "server.js"]
