const dotenv = require("dotenv").config();
const { User } = require("../models/Users");
const { Comment } = require("../models/Comments");
const { Post } = require("../models/Posts");

const controller = {
  // Likes post
  likePost: async (req, res) => {
    try {
      //Vérification du token
      if (req.user.id !== req.params.currentUser) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }

      //get currentUSer and post

      const currentUser = req.params.currentUser;
      const postId = req.params.postId;

      const user = await User.findOne({ _id: currentUser });
      const post = await Post.findOne({ _id: postId });

      if (!user) {
        return res.status(404).json({ message: "Vous devez être connecté" });
      }

      if (!post) {
        return res
          .status(404)
          .json({ message: "Post non trouvé, veuillez ressayer" });
      }

      // check if user liked post

      const likedPost = post.likes.includes(currentUser);
      const dislikedPost = post.dislikes.includes(currentUser);

      if (likedPost) {
        post.likes.splice(post.likes.indexOf(currentUser), 1);
        await post.save();

        return res.status(200).json({ message: "Liked deleted" });
      } else {
        // delete dislike if user when like post
        if (dislikedPost) {
          post.dislikes.splice(post.dislikes.indexOf(currentUser), 1);
          await post.save();
        }

        post.likes.push(currentUser);
        await post.save();
        return res.status(200).json({ message: "Liked" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  },

  // Dislike post
  dislikePost: async (req, res) => {
    try {
      //Vérification du token
      if (req.user.id !== req.params.currentUser) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }

      //get currentUSer and post

      const currentUser = req.params.currentUser;
      const postId = req.params.postId;

      const user = await User.findOne({ _id: currentUser });
      const post = await Post.findOne({ _id: postId });

      if (!user) {
        return res.status(404).json({ message: "Vous devez être connecté" });
      }

      if (!post) {
        return res
          .status(404)
          .json({ message: "Post non trouvé, veuillez ressayer" });
      }

      // check if user liked or disliked post

      const likedPost = post.likes.includes(currentUser);
      const dislikedPost = post.dislikes.includes(currentUser);

      if (dislikedPost) {
        post.dislikes.splice(post.dislikes.indexOf(currentUser), 1);
        await post.save();

        return res.status(200).json({ message: "Disliked deleted" });
      } else {
        // delete like if user when dislike post
        if (likedPost) {
          post.likes.splice(post.likes.indexOf(currentUser), 1);
          await post.save();
        }

        post.dislikes.push(currentUser);
        await post.save();
        return res.status(200).json({ message: "Disliked" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  },

  // Likes comment

  likeComment: async (req, res) => {
    try {
      //Vérification du token
      if (req.user.id !== req.params.currentUser) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }

      //get currentUSer and comment

      const currentUser = req.params.currentUser;
      const commentId = req.params.commentId;

      const user = await User.findOne({ _id: currentUser });
      const comment = await Comment.findOne({ _id: commentId });

      if (!user) {
        return res.status(404).json({ message: "Vous devez être connecté" });
      }

      if (!comment) {
        return res
          .status(404)
          .json({ message: "Commentaire non trouvé, veuillez ressayer" });
      }

      // check if user liked comment

      const likedComment = comment.likes.includes(currentUser);
      const dislikedComment = comment.dislikes.includes(currentUser);

      if (likedComment) {
        comment.likes.splice(comment.likes.indexOf(currentUser), 1);
        await comment.save();

        return res.status(200).json({ message: "Liked deleted" });
      } else {
        // delete dislike if user when like comment
        if (dislikedComment) {
          comment.dislikes.splice(comment.dislikes.indexOf(currentUser), 1);
          await comment.save();
        }

        comment.likes.push(currentUser);
        await comment.save();
        return res.status(200).json({ message: "Liked" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  },

  // dislike comment

  dislikeComment: async (req, res) => {
    try {
      //Vérification du token
      if (req.user.id !== req.params.currentUser) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }

      //get currentUSer and comment

      const currentUser = req.params.currentUser;
      const commentId = req.params.commentId;

      const user = await User.findOne({ _id: currentUser });
      const comment = await Comment.findOne({ _id: commentId });

      if (!user) {
        return res.status(404).json({ message: "Vous devez être connecté" });
      }

      if (!comment) {
        return res
          .status(404)
          .json({ message: "Commentaire non trouvé, veuillez ressayer" });
      }

      // check if user liked comment

      const likedComment = comment.likes.includes(currentUser);
      const dislikedComment = comment.dislikes.includes(currentUser);

      if (dislikedComment) {
        comment.dislikes.splice(comment.dislikes.indexOf(currentUser), 1);
        await comment.save();

        return res.status(200).json({ message: "Liked deleted" });
      } else {
        // delete dislike if user when like comment
        if (likedComment) {
          comment.likes.splice(comment.likes.indexOf(currentUser), 1);
          await comment.save();
        }

        comment.dislikes.push(currentUser);
        await comment.save();
        return res.status(200).json({ message: "Liked" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  },
};

module.exports = controller;
