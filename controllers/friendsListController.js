const { User } = require("../models/Users");
const controller = {
  // Afficher la liste des amis
  friendsList: async (req, res) => {
    try {
      //Vérification du token
      if (req.user.id !== req.params.currentUserId) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }
      //const currentUser = sessionStorage.getItem("userId");
      const currentUser = req.params.currentUserId;

      const user = await User.findOne({ _id: currentUser })
        .populate("friends")
        .populate("sentInvitations")
        .populate("receivedInvitations");

      const friendsList = user.friends.map((friend) => {
        return {
          id: friend._id,
          userName: friend.userName,
          avatar: friend.avatar,
          verifyProfile: friend.verifyProfile,
          isAdmin: friend.isAdmin,

        };
      });

      const sentInvitations = user.sentInvitations.map((friend) => {
        return {
          id: friend._id,
          userName: friend.userName,
          avatar: friend.avatar,
          verifyProfile: friend.verifyProfile,
          isAdmin: friend.isAdmin,
        };
      });

      const receivedInvitations = user.receivedInvitations.map((friend) => {
        return {
          id: friend._id,
          userName: friend.userName,
          avatar: friend.avatar,
          verifyProfile: friend.verifyProfile,
          isAdmin: friend.isAdmin,
        };
      });

      return res
        .status(200)
        .json({ friendsList, sentInvitations, receivedInvitations });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "catch", error });
    }
  },
};

module.exports = controller;
