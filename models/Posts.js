const mongoose = require("mongoose");
const joi = require("joi");
const { Comment } = require("../models/Comments");
const { User } = require("../models/Users");

const PostsSchema = mongoose.Schema(
  {
    post: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    picture: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostsSchema);

// validate Register user
function validatePost(obj) {
  const schema = joi.object({
    post: joi.string().trim().min(2).required(),
    comments: joi.array().items(
      joi.object({
        text: joi.string().trim().min(2).required(),
      })
    ),
  });
  return schema.validate(obj);
}
module.exports = {
  Post,
  validatePost,
};
