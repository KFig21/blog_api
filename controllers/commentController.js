const Comment = require("../models/comment");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.create_comment = [
  body("text", "Empty text").trim().escape(),
  body("user", "Empty user").trim().escape(),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        data: req.body,
        errors: errors.array(),
      });
      return;
    }
    const { text, user } = req.body;
    const postId = req.params.postid;
    const comment = new Comment({ text, user, postId });
    let post = await Post.findById(postId);
    post.comments = [...post.comments, comment];
    post = await post.save();
    console.log("post.comments", post.comments);
    comment.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ msg: `comment ${comment._id} sent` });
    });
  },
];

exports.get_comment = async function (req, res, next) {
  try {
    const comment = await Comment.findById(req.params.commentid);
    if (!comment) {
      return res
        .status(404)
        .json({ err: `Comment with id ${req.params.commentid} not found` });
    }
    res.status(200).json({ comment });
  } catch (err) {
    next(err);
  }
};
exports.get_comments = async function (req, res, next) {
  try {
    const allComments = await Comment.find({});
    const comments = allComments
      .filter((comment) => comment.postId === req.params.postid)
      .sort((a, b) => b.date - a.date);
    console.log(comments);
    if (!comments) {
      return res.status(404).json({ err: `Comments not found` });
    }
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.update_comment = async function (req, res, next) {
  try {
    const { text, user } = req.body;
    const comment = await Comment.findByIdAndUpdate(req.params.commentid, {
      text,
      user,
    });
    if (!comment) {
      return res.status(404).json({ msg: "Updated sucessfuly" });
    }
    res.status(200).json({ msg: "Updated sucessfuly" });
  } catch (err) {
    next(err);
  }
};

exports.delete_post_comments = async function (req, res, next) {
  try {
    const comment = await Comment.deleteMany({ postId: req.params.postid });
    if (!comment) {
      return res
        .status(404)
        .json({ err: `Comment with id ${req.params.id} not found` });
    }
    res
      .status(200)
      .json({ msg: `Comment ${req.params.id} deleted sucessfuly` });
  } catch (err) {
    next(err);
  }
};

exports.delete_comment = async function (req, res, next) {
  try {
    let commentId = req.params.commentid;
    // delete comment from post
    let post = await Post.findById(req.params.postid);
    let commentInPost = await Comment.findById(commentId);
    let newComments = await post.comments.filter(
      (comment) => comment.toString() !== commentInPost._id.toString()
    );
    post.comments = [...newComments];
    post = await post.save();
    // delete comment from comments
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ err: `Comment with id ${commentId} not found` });
    }
    res.status(200).json({ msg: `Comment ${commentId} deleted sucessfuly` });
  } catch (err) {
    next(err);
  }
};
