import { dataAccess } from "./src/dataAccess.js";
import { getArticles, extractIds } from "./src/getArticles.js";
import { sendToChat } from "./src/tgBot.js";

async function main() {
  // Fetch articles
  const articles = await getArticles();

  const incomingArticlesIds = extractIds(articles);
  // Save unique articles IDs to Azure
  dataAccess(incomingArticlesIds)
    .then((uniqueIds) => {
      // Send new articles to Telegram
      if (uniqueIds.length !== 0) {
        const newArticles = articles.filter((article) =>
          uniqueIds.includes(article.id),
        );
        console.log("New articles found:");
        console.log(newArticles);
        sendToChat(newArticles);
      } else {
        console.log("No new articles found.");
      }
    })
    .catch((ex) => console.log(ex.message));
}

main();
