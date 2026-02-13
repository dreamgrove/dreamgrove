FROM node:24-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
