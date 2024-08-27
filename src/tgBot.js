const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TG_TOKEN;

function telegramBot(newArticles) {
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

module.exports = {
  telegramBot,
};
