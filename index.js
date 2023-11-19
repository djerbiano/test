const express = require("express");
const logger = require("./middlewares/logger");
const errMiddleware = require("./middlewares/errMiddleware");
const connectToDb = require("./config/db");
const dotenv = require("dotenv").config();
let ejs = require("ejs");
const cors = require("cors");
const verifSessionStorage = require("./routes/privateRoute");
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const commentsRoute = require("./routes/comment");
const authRoute = require("./routes/auth");
const invitationRoute = require("./routes/invitation");
const friendsListRoute = require("./routes/friendsList");
const port = process.env.PORT || 5000;

const server = express();
server.use(cors());
server.use(express.json());
server.use("/images", express.static("images"));

// Middleware pour analyser les données URL encodées des formulaires
server.use(express.urlencoded({ extended: true }));

// connect to the database
connectToDb();

// Configuration du moteur de vue EJS
server.set("view engine", "ejs");

// Middleware pour enregistrer les informations de la requête
server.use(logger);

// Routes
server.get("/", async (req, res) => {
  try {
    return res.status(200).json({ message: "No access API" });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});
server.use("/api/auth", authRoute);
server.use("/api", verifSessionStorage);
server.use("/api/users", userRoute);
server.use("/api/posts", postsRoute);
server.use("/api/comments", commentsRoute);
server.use("/api/invitations", invitationRoute);
server.use("/api/friends", friendsListRoute);
server.all("*", (req, res) => {
  res.status(404).send("<h1>Page not found</h1>");
});

// Middleware pour gérer les erreurs
server.use(errMiddleware);

// Démarrer le serveur
server.listen(port, () => console.log(`Server listening on port ${port}`));
