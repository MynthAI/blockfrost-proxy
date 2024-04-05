FROM quay.io/mynth/node:18-dev as builder

WORKDIR /app
COPY --chown=noddy:noddy package*.json ./
RUN npm ci --omit dev
COPY --chown=noddy:noddy . ./

FROM quay.io/mynth/node:18-base
WORKDIR /app
COPY --from=builder --chown=noddy:noddy /app .

EXPOSE 3000
CMD ["npx", "tsx", "src/index.ts"]
