# GenomeX Backend - Production Multi-stage Dockerfile

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Prisma client generation
FROM node:20-alpine AS prisma
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate

# Stage 3: Final runtime
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

# Security: non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S genomex -u 1001

# Copy dependencies + generated Prisma client
COPY --from=deps --chown=genomex:nodejs /app/node_modules ./node_modules
COPY --from=prisma --chown=genomex:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=prisma --chown=genomex:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copy app source
COPY --chown=genomex:nodejs . .

USER genomex

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
