var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//create schema and model 
var ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
      type: String,
      required: true
    },
    // `link` is required and of type String
    link: {
      type: String,
      required: true
    },
    // `note` is an object that stores a Note id
    note: {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the article model
module.exports = Article;