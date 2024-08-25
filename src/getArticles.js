const cheerio = require("cheerio");

// lentodiilit
const getLDArticles = async () => {
  const response = await fetch("https://lentodiilit.fi/");
  const body = await response.text();
  const $ = cheerio.load(body);
  const articles = [];
  $("article[class^='post']").each((i, element) => {
    const article = {
      // id is the part after - in the class name started with post- and ended with space
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
};
const lDArticles = getLDArticles();

// print ids of articles
// getLDArticles().then((articles) => {
//   articles.forEach((article) => {
//     console.log(article.id);
//   });
// });

// halvatlennot
const getHLArticles = async () => {
  const response = await fetch(
    "https://www.halvatlennot.fi/HaeHinnanMukaan/HEL/1/Halvimmat-lennot-alkaen-Helsinki.htm"
  );
  const body = await response.text();
  const $ = cheerio.load(body);
  const articles = [];
  //   TODO

  return articles;
};
const hLArticles = getHLArticles();
console.log(hLArticles);
module.exports = {
  lDArticles,
  hLArticles,
};
