const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  sourceUrl: String,
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);