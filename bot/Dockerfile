FROM node:20

WORKDIR /app
COPY . .

RUN npm install

CMD ["pm2", "start", "discord.js"]