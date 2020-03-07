const mongoose = require("mongoose");// Exporting an object containing all of our models
const Article = require('./article.js');
const Comment = require('./comment.js');

module.exports = {
    Article,
    Comment
  };


