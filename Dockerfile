# ---------- BUILD STAGE ----------
FROM node:20-slim AS builder

WORKDIR /app

# Copy only dependency files first (for better caching)
COPY package*.json ./

# Install dependencies (using npm ci for clean, reproducible builds)
RUN npm ci

# Copy the entire project and build
COPY . .
RUN npm run build

# ---------- RUNTIME STAGE ----------
FROM node:20-slim AS runner

WORKDIR /app

# Copy only what’s needed for runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["npm", "start"]
