import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const objectKey = process.env.OBJECT_KEY;
const client = new S3Client({});

async function dataAccess(incomingArticlesIds) {
  let existingArticlesIds = [];
  // Check if the bucket and key exists
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket '${bucketName}' exists.`);

    try {
      // Check if the key exists
      await client.send(
        new HeadObjectCommand({ Bucket: bucketName, Key: objectKey }),
      );

      // Fetch existing articles
      const response = await client.send(
        new GetObjectCommand({ Bucket: bucketName, Key: objectKey }),
      );
      const readable = response.Body;
      const existingContent = await streamToString(readable);
      existingArticlesIds = JSON.parse(existingContent);
      console.log("Existing articles fetched successfully.");
      console.log(existingArticlesIds);
    } catch (error) {
      if (error.name === "NotFound") {
        // Key doesn't exist, create it
        const keyName = process.env.OBJECT_KEY;
        const newObject = [];

        await client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            Body: JSON.stringify(newObject),
            ContentType: "application/json",
          }),
        );

        console.log(`Created new key '${keyName}' in bucket '${bucketName}'.`);
      } else {
        throw error;
      }
    }
  } catch (err) {
    if (err.name === "NotFound") {
      console.error(`Bucket ${bucketName} not found.`);
      return { error: `Bucket ${bucketName} not found.` };
    } else {
      throw err;
    }
  }

  // Compare existing articles'IDs with new articles' IDs
  const articleIds = existingArticlesIds.map((article) => article.id);
  const uniqueIds = getUniqueIds(incomingArticlesIds, articleIds);

  // Merge new entries with existing content
  if (uniqueIds.length !== 0) {
    const newEntries = uniqueIds.map((id) => ({
      id,
      dateCreated: new Date().toISOString(),
    }));
    const updatedArticlesIds = [...existingArticlesIds, ...newEntries];

    // Upload updated content back to the s3
    const updatedContent = JSON.stringify(updatedArticlesIds, null, 2);
    const uploadParams = {
      Bucket: bucketName,
      Key: objectKey,
      Body: updatedContent,
    };
    await client.send(new PutObjectCommand(uploadParams));

    console.log("New entries added successfully.");
    return uniqueIds;
  } else {
    console.log("No new entries found.");
    return [];
  }
}

// Get unique IDs articles
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

export { dataAccess };
