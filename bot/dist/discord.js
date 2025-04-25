import { Client, GatewayIntentBits, Events } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.once(Events.ClientReady, (c) => {
  console.log(`✅ 봇 로그인 성공: ${c.user.tag}`);
});
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("!일정")) {
    // 예시: !일정 wjjung
    const parts = message.content.split(" ");
    const username = parts[1];
    const res = await fetch(
      `http://www.enfycius.com:8005/api/schedule/recom?user=${username}`
    );
    const text = await res.text();
    if (text.length === 0) {
      message.reply("📭 일정이 없습니다.");
      return;
    }
    message.reply(
      `@everyone\n 📋 추천 일정!!\n${text}\n👇 자세한 일정은 다음으로\nhttp://www.enfycius.com:3000`
    );
  }
});
client.login(process.env.DISCORD_TOKEN);
