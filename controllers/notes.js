// Bring in our Note mongoose model and makeDate scripts
var Note = require("../models/Note");
var makeDate = require("../scripts/date");


// functionality into module.exports to use throughout the rest of this program
module.exports = {
  // get function that will grab all of the notes that are associated with the articles
  // Don't start with the fetch function because we are not scraping note data in.
  get: function(data, cb) {
    // find all of the notes associated with the _headlineId in a question
    Note.find({
      _headlineId: data._id
    }, cb);
  },
  // save function takes in data from the user and call back function
  save: function(data, cb) {
    // create an object newNote that has the _headlineId associated with the note that's being created
    var newNote = {
      _headlineId: data._id,
      date: makeDate(),
      noteText: data.noteText
    };
    // takes the Note and creates one.
    // newNote as the actual note that it's creating and it runs a function to return an error or document
    Note.create(newNote, function (err, doc) {
      // if there's an error, it will tell us 
      if (err) {
        console.log(err);
      }
      // otherwise, it will pass the document(newNote) that was created to our call back function
      else {
        console.log(doc);
        cb(doc);
      }
    });
  },
  // delete function so that user can remove the notes associated with the articles as well
  delete: function(data, cb) {
    Note.remove({
      _id: data._id
    }, cb);
  }

}