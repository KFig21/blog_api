const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  text: { required: true, type: String },
  author: { required: true, type: String },
  published: { default: false, type: Boolean },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

PostSchema.virtual("submitted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Post", PostSchema);
