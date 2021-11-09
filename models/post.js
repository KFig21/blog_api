const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  text: { required: true, type: String },
  author: { required: true, type: String },
  published: { default: false, type: Boolean },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

postSchema.virtual("date_formated").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
