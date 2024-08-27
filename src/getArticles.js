const cheerio = require("cheerio");

// lentodiilit
const getLDArticles = async () => {
  try {
    const response = await fetch("https://lentodiilit.fi/");
    const body = await response.text();
    const $ = cheerio.load(body);
    const articles = [];
    $("article[class^='post']").each((i, element) => {
      const article = {
        id: $(element)
          .attr("class")
          .match(/post-(\d+)/)[1],
        title: $(element).find("h2").text(),
        link: $(element).find("a").attr("href"),
        description: $(element).find(".entry-content").text(),
      };
      articles.push(article);
    });
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
};

/**
 * Function to extract 'id' keys from an array of objects
 * @param {object[]} articles - Array of objects containing articles
 * @returns {string[]} - Array of IDs
 */
function extractIds(articles) {
  return articles.map((article) => article.id);
}

module.exports = {
  getLDArticles,
  extractIds,
};
