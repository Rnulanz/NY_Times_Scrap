// Require request and cheerio, making our scrapes possible
// var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");

var scrape = function(cb) {
  // First, we grab the body of the html with axios
    axios.get("http://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var articles = [];

    // Now, we grab every assetWrapper class, and do the following:
    $(".assetWrapper").each(function (i, element) {
        var head = $(this).find("h2").text().trim();
        var url = $(this).find("a").attr("href");
        var sum = $(this).find("p").text().trim();

    if (head && sum) {
        // replace regex method to cleanup our text with whitespace
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        var dataToAdd = {
            headline: headNeat,
            summary: sumNeat,
            link: "https://www.nytimes.com" + url,
        };
            articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;