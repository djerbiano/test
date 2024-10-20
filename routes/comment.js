const express = require("express");
const postController = require("../controllers/postsController");
const commentController = require("../controllers/commentController");
const likesDislikesController = require("../controllers/likesDislikesController");
const virifyToken = require("../middlewares/virifyToken");
const mult = require("../middlewares/multer");
const route = express.Router();

/******************************__Comments__****************************************/
// Get all comments

route.get("/:userId", virifyToken, commentController.getAllComments);

//Get one comment

route.get("/:userId/:commentId", virifyToken, commentController.getOneComment);

//Add comment

route.post(
  "/:userId/post/:postId/comment",
  virifyToken,
  commentController.addComment
);

//Delete comment

route.delete(
  "/:userId/post/:postId/comment/:commentId",
  virifyToken,
  commentController.deleteComment
);

/******************************like & dislake comment****************************************/

// like comment

route.patch(
  "/:currentUser/:commentId/likes",
  virifyToken,
  likesDislikesController.likeComment
);

// dislike comment

route.patch(
  "/:currentUser/:commentId/dislikes",
  virifyToken,
  likesDislikesController.dislikeComment
);
module.exports = route;
