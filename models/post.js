const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  date: { default: Date.now(), type: Date },
  text: { required: true, type: String },
  author: { required: true, type: String },
  published: { default: false, type: Boolean },
  comments: { type: Array },
});

postSchema.virtual("date_formated").get(function () {
  return this.date.toLocaleDateString("en-gb", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minutes: "2-digit",
  });
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
