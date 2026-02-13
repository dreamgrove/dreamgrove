FROM node:24-alpine
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
