const express = require("express");
const invitationController = require("../controllers/invitationController");
const virifyToken = require("../middlewares/virifyToken");
const route = express.Router();



//vérification l'existence d'amitié entre les utilisateurs
route.get("/:currentUserId/:otherUserId", virifyToken, invitationController.virifyFriendship);

//inviter comme ami
route.post("/:currentUserId/:otherUserId", virifyToken, invitationController.sentInvitations);

//accepter l'invitation
route.put("/:currentUserId/:otherUserId", virifyToken, invitationController.acceptInvitation);

//refuser l'invitation
route.delete("/:currentUserId/:otherUserId", virifyToken, invitationController.refuseInvitation);

//supprimer un ami
route.delete("/deleteFriend/:currentUserId/:otherUserId", virifyToken, invitationController.deleteUser);




module.exports = route;