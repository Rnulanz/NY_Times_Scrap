// Bring in our scrape script and makeDate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

// Bring in the Headline and Note mongoose models
var Headline = require("../models/Headline");

// functionality into module.exports to use throughout the rest of this program
module.exports = {
  // fetch to run the scrape function and grab all of the articles and insert them in headline collection in my mongodatabase
  fetch: function(cb) { // whenever I run fetch, I want it to run a function, I want to pass callback into that function
    // and then I want it to run scrape. When it run scrape, I want it to set the data to be called articles
    scrape(function(data) {
      var articles = data;
      // go through each articles and run makeDate and set saved to false on all of them
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }

      // run mongo function(not mongoose). Insert into the Headline collection lots of different articles
      // No need to be ordered
      Headline.collection.insertMany(articles, {ordered:false}, function(err, docs) {
        cb(err, docs);
      })
    })
  },
  // delete function to remove an article
  // whatever headline that was queried will be removed
  delete: function(query, cb) {
    Headline.remove(query, cb);
  },
  // fetch insert all of our articles to Headline collection
  // get function get all of the articles in the collection
  get: function(query, cb) {
    // find all the headlines in the query
    Headline.find(query)
    // sort them most recent to least recent
    .sort({
      _id: -1
    })
    // pass all those documents to our callback function
    .exec(function(err, doc) {
      cb(doc);
    });
  },
  // update function to update articles
  update: function(query, cb) {
    // update any new articles that are scraped with the relevant id and
    // update any information that is passed to those articles with that information as well
    Headline.update({ _id: query._id }, {
      $set: query
    }, {}, cb);
  }
}