import pkg from "node-telegram-bot-api";
const TelegramBot = pkg;

const token = process.env.TG_TOKEN;

export async function sendToChat(newArticles) {
  console.log("Sending new articles to chat...");
  const bot = new TelegramBot(token);
  console.log("Bot started");

  const messagePromises = newArticles.map(async (article) => {
    const message = `<b>${article.title}</b>\n<a href="${article.link}">${article.link}</a>\n${article.description}`;
    return bot.sendMessage(process.env.TG_CHAT_ID, message, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  });

  await Promise.all(messagePromises);
  console.log("Articles sent to chat.");
}
