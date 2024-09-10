import { main } from "./index.js";

export const handler = async (event, context) => {
  try {
    await main();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Execution successful" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
