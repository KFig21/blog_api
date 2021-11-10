const Post = require("../models/post");
const { body, validationResult } = require("express-validator");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

exports.create_post = [
  body("author", "Empty name").trim().escape(),
  body("title", "text").trim().escape(),

  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }
    // title, date - default to created time, author, published - default to false
    const { author, title, text } = req.body;
    const post = new Post({
      author,
      title,
      text,
    });
    post.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ msg: "post sent" });
    });
  },
];

exports.get_posts = async function (req, res, next) {
  try {
    var posts = await Post.find({});
    posts.sort((a, b) => b.date - a.date);
    if (!posts) {
      return res.status(404).json({ err: "posts not found" });
    }
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.get_single_post = async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ err: `post with id ${req.params.id} not found` });
    }
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.update_post = async function (req, res, next) {
  try {
    const { author, title, text, slug, sanitizedHtml } = req.body;
    // const slug = slugify(this, { lower: true, strict: true })
    // const sanitizedHtml = dompurify.sanitize(marked(text))
    const post = await Post.findByIdAndUpdate(req.params.id, {
      author,
      title,
      text,
      slug,
      sanitizedHtml,
    });
    if (!post) {
      return res.status(404).json({ msg: "updated sucessfuly" });
    }
    res.status(200).json({ msg: "updated sucessfuly" });
  } catch (err) {
    next(err);
  }
};

exports.delete_post = async function (req, res, next) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ err: `posts with id ${req.params.id} not found` });
    }
    res.status(200).json({ msg: `post ${req.params.id} deleted sucessfuly` });
  } catch (err) {
    next(err);
  }
};
