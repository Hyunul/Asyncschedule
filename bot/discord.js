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
    try {
      const res = await fetch("http://www.hyunul.site:8080/api/schedule/recom");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      const list = text ? JSON.parse(text) : [];

      if (
        !Array.isArray(list) ||
        list.length === 0 ||
        (list.length === 1 && list[0].includes("추천 시간이 없습니다"))
      ) {
        message.reply("📭 추천 일정이 없습니다.");
        return;
      }

      const formatted = list
        .map((item, i) => `✅ ${i + 1}. ${item}`)
        .join("\n");

      message.reply(
        `@everyone\n📋 추천 일정 목록!\n\n${formatted}\n\n👇 자세한 일정은 다음으로\nhttp://www.hyunul.site`
      );
    } catch (err) {
      console.error("❌ 일정 추천 요청 실패:", err);
      message.reply("🚨 서버 오류로 추천 일정을 불러오지 못했습니다.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
