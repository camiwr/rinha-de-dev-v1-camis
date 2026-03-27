FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci --no-audit --no-fund

COPY src ./src
RUN npm run build

RUN npm prune --omit=dev

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/dist        ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

ENV NODE_OPTIONS="--max-old-space-size=100"

EXPOSE 8080

CMD ["node", "dist/index.js"]