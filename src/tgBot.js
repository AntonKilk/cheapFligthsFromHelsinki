import pkg from "node-telegram-bot-api";
const TelegramBot = pkg;

const token = process.env.TG_TOKEN;

export function sendToChat(newArticles) {
  const bot = new TelegramBot(token, { polling: true });
  newArticles.forEach((article) => {
    const message = `<b>${article.title}</b>\n<a href="${article.link}">${article.link}</a>\n${article.description}`;
    bot.sendMessage(process.env.TG_CHAT_ID, message, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  });

  bot.stopPolling();
}
