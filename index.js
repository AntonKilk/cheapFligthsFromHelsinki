import { dataAccess } from "./src/dataAccess.js";
import { getArticles, extractIds } from "./src/getArticles.js";
import { sendToChat } from "./src/tgBot.js";

export async function handler(event, context) {
  try {
  // Fetch articles
  const articles = await getArticles();

  console.log("Extracting IDs from incoming articles...");
  const incomingArticlesIds = extractIds(articles);
  console.log(incomingArticlesIds);
  // Save unique articles IDs to Azure
  console.log("Checking for new articles");
  const uniqueIds = await dataAccess(incomingArticlesIds)
  console.log("Unique IDs:");
  console.log(uniqueIds);
      // Send new articles to Telegram
      if (uniqueIds.length !== 0) {
        const newArticles = articles.filter((article) =>
          uniqueIds.includes(article.id),
        );
        console.log("New articles found:");
        console.log(newArticles);
        await sendToChat(newArticles);
      } else {
        console.log("No new articles found.");
      }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Execution successful' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
}

// Run locally
// handler();