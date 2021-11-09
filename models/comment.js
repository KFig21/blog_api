const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  date: { type: Date, default: Date.now, required: true },
  text: { required: true, type: String },
  user: { required: true, type: String },
  postId: { type: String, required: true },
});

commentSchema.virtual("date_formated").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
