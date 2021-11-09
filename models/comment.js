const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const commentSchema = new Schema({
  date: { type: Date, default: Date.now, required: true },
  text: { required: true, type: String },
  user: { required: true, type: String },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
});

commentSchema.virtual("submitted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
