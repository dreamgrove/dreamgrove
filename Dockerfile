FROM node:24-alpine
RUN apk add --no-cache libc6-compat
# corepack picks the pnpm version from package.json's packageManager field
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
