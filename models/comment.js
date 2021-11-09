const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema({
  date: { type: Date, default: Date.now, required: true },
  text: { required: true, type: String },
  user: { required: true, type: String },
  postId: { type: String, required: true },
});

CommentSchema.virtual("submitted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Comment", CommentSchema);
