FROM node:22-alpine AS base

LABEL org.opencontainers.image.authors="yvan.lubac@euro-argo.eu"
LABEL org.opencontainers.image.description="image of Gateway NestJS app"
LABEL org.opencontainers.image.url="https://github.com/British-Oceanographic-Data-Centre/amrit-repos"
LABEL org.opencontainers.image.source="https://github.com/British-Oceanographic-Data-Centre/amrit-repos"
LABEL org.opencontainers.image.documentation="https://github.com/British-Oceanographic-Data-Centre/amrit-repos/wiki"
LABEL org.opencontainers.image.licenses="TBD"
LABEL org.opencontainers.image.vendor="Advance Marine Research Infrastructures Together (AMRIT)"

USER root
# =====install deps====
FROM base AS deps
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./
# Install dependencies only when needed
RUN npm ci


# =====build step====
# Build the NestJS application
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# =====run step====
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

# Command to run the application
ENV HOSTNAME="0.0.0.0"
CMD ["node", "dist/main.js"]
