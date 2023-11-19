const dotenv = require("dotenv").config();
const { User } = require("../models/Users");
const fs = require("fs");
const path = require("path");

const controller = {
  // Virification l'existence d'amitié entre les utilisateurs
  virifyFriendship: async (req, res) => {
    try {
      //Vérification du token
      if (req.user.id !== req.params.currentUserId) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }
      //const currentUser = sessionStorage.getItem("userId");
      const currentUser = req.params.currentUserId;
      const otherUser = req.params.otherUserId;

      const user = await User.findOne({ _id: currentUser });

      const friendsList = user.friends.includes(otherUser);
      const sentInvitations = user.sentInvitations.includes(otherUser);
      const receivedInvitations = user.receivedInvitations.includes(otherUser);

      if (!friendsList && !sentInvitations && !receivedInvitations) {
        return res.status(200).json({ message: "Inviter" });
      }

      if (friendsList) {
        return res.status(200).json({ message: "Ami" });
      }

      if (sentInvitations) {
        return res.status(200).json({ message: "Demande envoyée" });
      }

      if (receivedInvitations) {
        return res.status(200).json({ message: "Accepter l'invitation" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "catch", error });
    }
  },

  // Inviter comme ami

  sentInvitations: async (req, res) => {
    try {
      //Vérification du token
      if (req.user.id !== req.params.currentUserId) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }

      const currentUser = req.params.currentUserId;
      const otherUser = req.params.otherUserId;

      const user = await User.findOne({ _id: currentUser });
      const friendsList = user.friends.includes(otherUser);
      const sentInvitations = user.sentInvitations.includes(otherUser);
      const receivedInvitations = user.receivedInvitations.includes(otherUser);

      if (!friendsList && !sentInvitations && !receivedInvitations) {
        const userInvited = await User.findOne({ _id: otherUser });

        user.sentInvitations.push(otherUser);
        userInvited.receivedInvitations.push(currentUser);
        await user.save();
        await userInvited.save();
        return res.status(200).json({ message: "Demande d'ami envoyée" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "catch", error });
    }
  },

  // Accepter l'invitation

  acceptInvitation: async (req, res) => {
    try {
      //Vérification du token
      if (req.user.id !== req.params.currentUserId) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }

      const currentUser = req.params.currentUserId;
      const otherUser = req.params.otherUserId;

      const user = await User.findOne({ _id: currentUser });
      const invitedUser = await User.findOne({ _id: otherUser });

      // Ajouter comme ami des deux cotés
      user.friends.push(otherUser);
      invitedUser.friends.push(currentUser);

      //supprimer les invitations en attente des deux cotés
      const index = user.receivedInvitations.indexOf(otherUser);
      const index2 = invitedUser.sentInvitations.indexOf(currentUser);

      user.receivedInvitations.splice(index, 1);
      invitedUser.sentInvitations.splice(index2, 1);

      await user.save();
      await invitedUser.save();

      return res.status(200).json({ message: "Invitation acceptée" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "catch", error });
    }
  },

  // Refuser l'invitation

  refuseInvitation: async (req, res) => {
    try {
      //Vérification du token
      if (req.user.id !== req.params.currentUserId) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }

      const currentUser = req.params.currentUserId;
      const otherUser = req.params.otherUserId;

      const user = await User.findOne({ _id: currentUser });
      const invitedUser = await User.findOne({ _id: otherUser });

      //supprimer les invitations en attente des deux cotés

      const index = user.receivedInvitations.indexOf(otherUser);
      const index2 = invitedUser.sentInvitations.indexOf(currentUser);

      user.receivedInvitations.splice(index, 1);
      invitedUser.sentInvitations.splice(index2, 1);

      await user.save();
      await invitedUser.save();

      return res.status(200).json({ message: "Invitation refusée" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "catch", error });
    }
  },

  // Supprimer un utilisateur

  deleteUser: async (req, res) => {
    try {

      //Vérification du token
      if (req.user.id !== req.params.currentUserId) {
        return res.status(403).json({
          message: "Token non valide, veuillez vous reconnecter",
        });
      }

      const currentUser = req.params.currentUserId;
      const otherUser = req.params.otherUserId;

      const user = await User.findOne({ _id: currentUser });
      const invitedUser = await User.findOne({ _id: otherUser });

      //supprimer un user de la liste des deux cotés

      const index = user.friends.indexOf(otherUser);
      const index2 = invitedUser.friends.indexOf(currentUser);

      user.friends.splice(index, 1);
      invitedUser.friends.splice(index2, 1);

      await user.save();
      await invitedUser.save();

      return res.status(200).json({ message: "Utilisateur supprimé !" });
      
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "catch", error });
    }
  }
};

module.exports = controller;
