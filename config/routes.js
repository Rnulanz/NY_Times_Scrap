// Bring in the Scrape function from our scripts directory
var scrape = require("../scripts/scrape");

// Bring headlines and notes from the controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router) {
  // This route renders the homepage
  router.get("/", function(req, res) {
    res.render("home");
  });

  // this route renders the saved handlebars page
  router.get("/saved", function(req, res) {
    res.render("saved");
  });

  // routes that will be using the controllers
  // whenever we get the route /api/fetch, run this function
  // the request that we are passing in here is the request to scrape and fetch the data and insert into our collection
  // if it is a new unique headline (fetch function in headlines.js)
  router.get("/api/fetch", function(req, res) { 
    // go to headlinesController and run fetch and then popup the message to the user
    headlinesController.fetch(function(err, docs) {
      // if there are no new articles added or there just aren't any articles at all
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "No new articles today. Check back tomorrow!"
        });
      }
      // else, tell the user how many articles you added
      else {
        res.json({
          message: "Added " + docs.insertedCount + " new articles!"
        });
      }
    });
  });

  // route goes along with our get function in the headlines controller
  // whenever the router hits /api/headlines, take in with the user request in and respond appropriately
  router.get("/api/headlines", function(req, res) {
    // the user's request is defined by query, at the first query is empty
    // if the user doesn't specify anything, return everything in this res.json.data
    var query = {};
    // if the user specifies a saved article or any specific parameter, set the query equal to that
    if (req.query.saved) {
      query = req.query;
    }

    headlinesController.get(query, function(data) {
      res.json(data);
    });
  });

  // route to handle deleting a specific article
  router.delete("/api/headlines/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;
    headlinesController.delete(query, function(err, data) {
      res.json(data);
    });
  });

  // route to update headlines
  router.patch("/api/headlines", function(req, res) {
    headlinesController.update(req.body, function(err, data) {
      res.json(data);
    });
  });

  // route that will handle grabbing all the notes associated with an article
  router.get("/api/notes/:headline_id?", function(req, res) {
    var query = {};
    // if there's parameter users sets exist
    if (req.params.headline_id) {
      // set the query._id equal to the param that they set
      query._id = req.params.headline_id;
    }

    notesController.get(query, function(err, data) {
      res.json(data);
    });
  });

  // route to delete notes
  router.delete("/api/notes/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;
    notesController.delete(query, function(err, data) {
      res.json(data);
    });
  });

  // route to post new notes to articles
  router.post("/api/notes", function(req, res) {
    notesController.save(req.body, function(data) {
      res.json(data);
    });
  });
  
}