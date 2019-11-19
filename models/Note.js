var mongoose = require("mongoose");

// Using mongoose method to create a Schema
var Schema = mongoose.Schema;

// creating a new schema called noteSchema
var noteSchema = new Schema({
  // associated article that we want to attatch the note to
    _headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
},
    date: String,
  // User's note text that they type in as string
    noteText: String
});

// Create note model
var Note = mongoose.model("Note", noteSchema);
// export Note
module.exports = Note;
