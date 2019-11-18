// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Comment and Article models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");


module.exports = function (app) {

    app.get('/', function (req, res) {
        res.redirect('/articles');
    });

    app.get("/scrape", function(req, res) {

        request("http://www.nytimes.com/", function(error, response, html) {
        // console.log(response);
        // console.log(data);
        var $ = cheerio.load(html);
        // var $ = cheerio.load(response.data);


        console.log("scrapping");
        // Now grab every a tag url within an article heading  and iterate through it
        // and perform the following
        $(".css-6p6lnl").each(function (i, element) {
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
            result.sum = sum

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
    Article.find({}, function (error, data) {
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
  
    // Create a new comment
    app.post("/articles/:id", function (req, res) {
      // Create a new Comment and pass the req.body to the entry
      Comment.create(req.body, function (error, data) {
          // Log any errors
          if (error) {
            console.log(error// Otherwise
            );
          } else {
            // Use the article id to find and update it's comment
            Article.findOneAndUpdate({
              "_id": req.params.id
            }, {
              $push: {
                "comment": data._id
              }
            }, {
              safe: true,
              upsert: true,
              new: true
            })
            // Execute the above query
              .exec(function (err, data) {
                // Log any errors
                if (err) {
                  console.log(err);
                } else {
                  // Or send the document to the browser
                  res.redirect('back');
                }
              });
          }
        });
    });
    app.delete("/articles/:id/:commentid", function (req, res) {
      Comment.findByIdAndRemove(req.params.commentid, function (error, data) {
          // Log any errors
          if (error) {
            console.log(error// Otherwise
            );
          } else {
            console.log(data);
            Article.findOneAndUpdate({
              "_id": req.params.id
            }, {
              $pull: {
                "comment": data._id
              }
            })
            // Execute the above query
              .exec(function (err, doc) {
                // Log any errors
                if (err) {
                  console.log(err);
                }
              });
          }
        });
    });
}