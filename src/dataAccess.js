const articles = require("./getArticles");
const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();
const { DefaultAzureCredential } = require("@azure/identity");

async function azureAccess(incomingArticlesIds) {
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
    const articleIds = existingArticles.map((article) => article.id);
    const uniqueIds = getUniqueIds(incomingArticlesIds, articleIds);

    // Merge new entries with existing content
    if (uniqueIds.length !== 0) {
      const newEntries = uniqueIds.map((id) => ({
        id,
        dateCreated: new Date().toISOString(),
      }));
      const updatedArticles = [...existingArticles, ...newEntries];

      // Upload updated content back to the blob
      const updatedContent = JSON.stringify(updatedArticles, null, 2);
      await blockBlobClient.upload(updatedContent, updatedContent.length);

      console.log("New entries added successfully.");
      return uniqueIds;
    } else {
      console.log("No new entries found.");
      return [];
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

// Get unique IDs from incoming articles
function getUniqueIds(incomingArticlesIds, existingArticlesIds) {
  return incomingArticlesIds.filter((id) => !existingArticlesIds.includes(id));
}

// Convert stream to text
async function streamToString(readable) {
  readable.setEncoding("utf8");
  let data = "";
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}

module.exports = {
  azureAccess,
};
