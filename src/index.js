const articles = require("./getArticles");
const ldArticles = articles.getLDArticles();
const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();
const { DefaultAzureCredential } = require("@azure/identity");

async function main() {
  try {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName) throw Error("Azure Storage accountName not found");

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );

    const containerName = "cheapflightcontainer1";
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = "articles.json";
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Fetch existing articles' IDs
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const existingContent = await streamToString(
      downloadBlockBlobResponse.readableStreamBody
    );
    let existingArticles = [];
    if (existingContent) {
      existingArticles = JSON.parse(existingContent);
    } else {
      console.log("No existing articles found");
    }

    // Compare existing articles'IDs with new articles' IDs
    // replace newIDs with input from scraped articles
    const articleIds = existingArticles.map((article) => article.id);
    const uniqueIds = newIDs.filter((id) => !articleIds.includes(id));
    const newEntries = uniqueIds.map((id) => ({
      id,
      dateCreated: new Date().toISOString(),
    }));

    // Merge new entries with existing content
    const updatedArticles = [...existingArticles, ...newEntries];

    // Upload updated content back to the blob
    const updatedContent = JSON.stringify(updatedArticles, null, 2);
    await blockBlobClient.upload(updatedContent, updatedContent.length);

    console.log("New entries added successfully.");
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

main()
  .then(() => console.log("Done"))
  .catch((ex) => console.log(ex.message));

// Convert stream to text
async function streamToString(readable) {
  readable.setEncoding("utf8");
  let data = "";
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}

/**
 * Function to get downloaded content and return an array of IDs
 * @param {string|object[]} downloadedContent - The downloaded content, either as a JSON string or an array of objects
 * @returns {string[]} - Array of IDs
 */
function getArticleIds(existingContent) {
  if (typeof existingContent === "string") {
    existingContent = JSON.parse(existingContent);
  } else {
    throw Error("Invalid downloaded content");
  }
  return downloadedContent.map((article) => article.id);
}

const newIDs = ["2", "123", "456", "789", "1", "abc"];
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
