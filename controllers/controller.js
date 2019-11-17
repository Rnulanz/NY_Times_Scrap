// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Comment and Article models
var Comment = require("../models/Comment");
var Article = require("../models/Article");


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
            var artSin = $(this)
            .children("div.text")
            .text();

        if (head && url && artSin) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every url, and save them as properties of the
            // result object
            result.head = head;
            result.url = url;
            result.artSin = artSin;

            // Using our Article model, create a new entry
            Article.create(result, function (error, data) {
              // Log any errors
                if (err) {
                console.log(error);
                } else {
                console.log(data);
                }
            });
            }
        });
        });
      // Tell the browser that we finished scraping the text
        res.redirect("/");
    });

      // This will get the articles we scraped from the mongoDB
  app.get("/articles", function (req, res) {
    // Grab every doc in the Articles array
    Article
      .find({}, function (error, data) {
        // Log any errors
        if (error) {
          console.log(error);
        } else {
          res.render("index", {result: data});
        }
        //Will sort the articles by most recent (-1 = descending order)
      })
      .sort({'_id': -1});
  });

    // Grab an article by it's ObjectId
    app.get("/articles/:id", function (req, res) {
      // Using the id passed in the id parameter, prepare a query that finds the
      // matching one in our db...
      Article.findOne({"_id": req.params.id})
      // ..and populate all of the comments associated with it
        .populate("comment")
      // now, execute our query
        .exec(function (error, data) {
          // Log any errors
          if (error) {
            console.log(error)
          } else {
            res.render("comments", {result: data});
            // res.json (doc);
          }
        });
    });
}