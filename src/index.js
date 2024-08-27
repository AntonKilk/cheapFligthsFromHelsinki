const { azureAccess } = require("./dataAccess");

async function main() {
  await azureAccess();
}
// Create a function that enters the Azure blob storage
// and fetches the json file that stores the article IDs

// Create a function that gets articles IDs from fetched articles
// and returns an array of unique IDs

// Create a function that saves the unique IDs to the Azure blob storage

// create function that gets fetched articles unique IDs
// and returns object that stores articles with unique IDs

// ldArticles.then((articles) => {
//   articles.forEach((article) => {
//     console.log(article.id);
//   });
// });
