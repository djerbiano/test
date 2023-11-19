const express = require("express");
const friendsListController = require("../controllers/friendsListController");
const virifyToken = require("../middlewares/virifyToken");
const route = express.Router();



//vérification l'existence d'amitié entre les utilisateurs
route.get("/:currentUserId", virifyToken, friendsListController.friendsList);






module.exports = route;