var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    head: {
        type: String,
        required: true,
        unique: true
    },

    url: {
        type: String,
        required: true,
        unique: true
    },

    artSin: {
        type: String,
        required: true,
        unique: true
    },

    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

var Article = mongoose.model("Article", ArticleSchema)

module.exports = Article