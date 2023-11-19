const express = require("express");
const postController = require("../controllers/postsController");
const commentController = require("../controllers/commentController");
const likesDislikesController = require("../controllers/likesDislikesController");
const virifyToken = require("../middlewares/virifyToken");
const mult = require("../middlewares/multer");
const route = express.Router();

/******************************__Posts__****************************************/
//Get all posts
route.get("/:currentUser", virifyToken, postController.getAllPosts);

//Get my posts
route.get("/:currentUser/myPosts", virifyToken, postController.getMyPosts);

//Get one post
route.get("/:currentUser/:postId", virifyToken, postController.getOnePost);

//Add post
route.post("/:userId/post", virifyToken, mult, postController.addPost);

//Delete post
route.delete("/:userId/post/:postId", virifyToken, postController.deletePost);

/******************************like & dislake Post****************************************/
// like post

route.patch(
  "/:currentUser/:postId/likes",
  virifyToken,
  likesDislikesController.likePost
);

// dislike post

route.patch(
  "/:currentUser/:postId/dislikes",
  virifyToken,
  likesDislikesController.dislikePost
);

module.exports = route;
