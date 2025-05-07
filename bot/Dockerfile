FROM node:20

WORKDIR /app
COPY . .

RUN npm install
RUN npm install -g pm2

CMD ["pm2", "start", "discord.js"]