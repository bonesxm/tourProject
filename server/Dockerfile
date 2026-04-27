FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY .env.example ./.env.example

ENV NODE_ENV=production
ENV PORT=8085

RUN mkdir -p /app/uploads

EXPOSE 8085

CMD ["node", "src/index.js"]

