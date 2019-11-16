// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Comment and Article models
var Comment = require("../models/comment.js");
var Article = require("../models/article.js");


module.exports = function (app) {

    app.get('/', function (req, res) {
        res.redirect('/articles');
    });

    app.get("/scrape", function (req, res) {
      //use request dependecy to grab the body of the html
    request("http://www.nytimes.com", function (error, response, html) {
        //Save the body of the html into a variabl called $  within cheerio
        var $ = cheerio.load(html);
        // Now grab every a tag url within an article heading  and iterate through it
        // and perform the following
        $(".post-excerpt").each(function (i, element) {
            var head = $(this)
            .children("h2")
            .children("a")
            .text();
            var url = $(this)
            .children("h2")
            .children("a")
            .attr("href");
            var sum = $(this)
            .children("div.text")
            .text();

        if (head && url && sum) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every url, and save them as properties of the
            // result object
            result.head = head;
            result.url = url;
            result.sum = sum;

            // Using our Article model, create a new entry
            Article.create(result, function (err, doc) {
              // Log any errors
                if (err) {
                console.log(err// Or log the doc
                );
                } else {
                console.log(doc);
                }
            });
            }
        });
        });
      // Tell the browser that we finished scraping the text
        res.redirect("/");
    });

}