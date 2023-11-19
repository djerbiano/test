const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { User, validateNewPassword } = require("../models/Users");
const nodemailer = require("nodemailer");

const controller = {
  // Rendre la page de réinitialisation de mot de passe
  showForgotPasswordPage: async (req, res) => {
    let errorMessage = "";
    res.render("forgot-password", { errorMessage });
  },

  // Reset password
  sendResetPasswordLink: async (req, res) => {
    try {
      const emailUser = req.body.email;

      const user = await User.findOne({ email: emailUser });
      if (!user) {
        let errorMessage =
          "Si votre adresse e-mail est enregistrée dans notre base de données, vous recevrez bientôt un e-mail contenant un lien pour réinitialiser votre mot de passe. Veuillez vérifier votre boîte de réception, y compris le dossier de courrier indésirable.";
        return res.render("forgot-password", { errorMessage });
      } else {
        const secret = process.env.JWT_SECRET_KEY + user.password;
        const token = jwt.sign(
          { id: user._id, username: user.userName },
          secret,
          { expiresIn: "10m" }
        );

        const resetLink = `http://localhost:3000/api/auth/setResetPassword/${user._id}/${token}`;
        let errorMessage =
          "Veuillez consulter votre boîte mail pour changer votre mot de passe";
        ///////send mail//////////
        const likeMail = ` 
        <h2>Changement de mot de passe</h2>
        <br/>
        <p>Bonjour ${user.userName},</p>
        <br/>
        <p>Suite à votre demande, vous pouvez changer votre mot de passe en cliquant sur le lien suivant :</p>
        <p>Vous avez 10 minutes pour effectuer le changement</p>
        <br/>
        <a href="${resetLink}">Modifier votre mot de passe</a>
        <br/>
        <p>Si vous n'ête pas à l'origine de cette demande, veuillez ignorer ce mail</p>
        <br/>
        <br/>
        <h3>L'équipe d'Espace Pro Social</h3>

        `;
        const userMail = user.email;
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASSWORD,
          },
        });
        async function main() {
          const info = await transporter.sendMail({
            from: '"Espace Pro Social 👻" <admin@EspaceProSocial.com>',
            to: userMail,
            subject: "Espace Pro Social ✔",
            text: "réinitialisation de mot de passe",
            html: likeMail,
          });
          console.log("Message sent: %s", info.messageId);
        }

        main().catch(console.error);
        return res.render("forgot-password", { errorMessage });
      }
    } catch (error) {
      return res.status(400).json({ message: "invalid email" });
    }
  },

  // Reset password
  showResetPasswordForm: async (req, res) => {
    try {
      // Récupération des paramètres d'URL
      const { id, token } = req.params;

      // Recherche de l'utilisateur en utilisant l'ID
      const user = await User.findOne({ _id: id });
      if (!user) {
        // Si l'utilisateur n'est pas trouvé, retourner une réponse 404
        let errorMessage = `L'utilisateur avec l'id: ${id} n'existe pas`;
        return res.render("reset-password", { errorMessage });
      } else {
        // Création de la clé secrète pour vérifier le token
        const secret = process.env.JWT_SECRET_KEY + user.password;

        // Vérification du token
        const verificationToken = jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            // Si le token est invalide ou expiré, retourner une réponse 400
            let errorMessage =
              "Le lien de réinitialisation de mot de passe a expiré";
            return res.render("reset-password", { errorMessage });
          } else {
            let errorMessage;
            const { error } = validateNewPassword(req.body.password);
            if (error) {
              errorMessage = error.details[0].message;
            }
            return res.render("reset-password", { errorMessage });
          }
        });
      }
    } catch (error) {
      let errorMessage = `Le lien de réinitialisation de mot de passe a expiré`;
      return res.render("reset-password", { errorMessage });
    }
  },
  // Reset password
  saveResetPassword: async (req, res) => {
    try {
      // Récupération des paramètres d'URL
      const { id, token } = req.params;

      // Recherche de l'utilisateur en utilisant l'ID
      const user = await User.findOne({ _id: id });
      if (!user) {
        // Si l'utilisateur n'est pas trouvé, retourner une réponse 404
        let errorMessage = `L'utilisateur avec l'id: ${id} n'existe pas`;
        return res.render("reset-password", { errorMessage });
      }
      // Création de la clé secrète pour vérifier le token
      const secret = process.env.JWT_SECRET_KEY + user.password;

      // Vérification du token
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          // Si le token est invalide ou expiré, retourner une réponse 400
          let errorMessage = `Le lien de réinitialisation de mot de passe a expiré`;
          return res.render("reset-password", { errorMessage });
        }

        if (req.params.id !== decoded.id) {
          // Si le token est valide mais ne correspond pas à l'ID, retourner une réponse 400
          let errorMessage = `Le lien de réinitialisation de mot de passe a expiré`;
          return res.render("reset-password", { errorMessage });
        }

        // Si le token est valide et correspond à l'ID, retourner une réponse 200
        let errorMessage;
        const { error } = validateNewPassword(req.body);
        if (error) {
          errorMessage = error.details[0].message;
          return res.render("reset-password", { errorMessage });
        } else {
          const salt = bcrypt.genSaltSync(10);
          req.body.password = bcrypt.hashSync(req.body.password, salt);
          user.password = req.body.password;
          user.save();
          return res.render("success-password-reset");
        }
      });
    } catch (error) {
      let errorMessage = `Le lien de réinitialisation de mot de passe a expiré`;
      return res.render("reset-password", { errorMessage });
    }
  },
};

module.exports = controller;
