const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");
const slugify = require("slugify");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    text: { required: true, type: String },
    author: { required: true, type: String },
    published: { default: false, type: Boolean },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    slug: { type: String, required: true, unique: true },
    sanitizedHtml: { type: String, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

dompurify.addHook("afterSanitizeAttributes", function (node) {
  // set all elements owning target to target=_blank
  if ("target" in node) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener");
  }
});

PostSchema.pre("validate", function (next) {
  // create slug for url using post title
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // sanitize post so it cannot be hacked. Set it up for markdown
  if (this.text) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.text));
  }

  next();
});

PostSchema.virtual("submitted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Post", PostSchema);
