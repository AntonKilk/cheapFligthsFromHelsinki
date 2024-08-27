const { azureAccess } = require("./dataAccess");
const { getLDArticles, extractIds } = require("./getArticles");
const { telegramBot } = require("./tgBot");

async function main() {
  // Fetch articles
  const articles = await getLDArticles();
  const incomingArticlesIds = extractIds(articles);
  // Save unique articles IDs to Azure
  azureAccess(incomingArticlesIds)
    .then((uniqueIds) => {
      // Send new articles to Telegram
      if (uniqueIds.length !== 0) {
        const newArticles = articles.filter((article) =>
          uniqueIds.includes(article.id)
        );
        console.log("New articles found:");
        console.log(newArticles);
        telegramBot(newArticles);
      } else {
        console.log("No new articles found.");
      }
    })
    .catch((ex) => console.log(ex.message));
}
main();
