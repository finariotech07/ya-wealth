# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g       # install PM2 globally

COPY . .
EXPOSE 3001
CMD ["pm2-runtime", "index.js"]

