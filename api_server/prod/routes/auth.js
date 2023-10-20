const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fieldsMiddleware = require("../middleware/formidable");
const { authMiddleware } = require("../middleware/auth");

// Prevent too many requests
const rateLimit = require("express-rate-limit");
const registerLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 700, // Limit each IP to 700 requests per `window`
  message: "Too many request, please try again after an 5 minutes.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = (db) => {
  const dbController = require("../controllers/db")(db, "users");

  router
    .post("/login", registerLimiter, fieldsMiddleware, async (req, res) => {
      let user = null;
      const { mail, password } = req.fields;

      // Check required fields
      if (!(mail && password)) {
        res.status(400).send("Veuillez remplir tous les champs.");
      }

      // Check if user exists and get their informations
      user = await dbController.searchEntry(
        mail,
        "id, mail, password",
        false,
        "mail"
      );
      if (!user.statut)
        res.status(500).send("Une erreur est survenue avec votre identifiant.");
      else if (user.results.length <= 0)
        res
          .status(409)
          .send("Votre identifiant ou votre mot de passe est incorrect.");
      else user = user.results[0];

      // Check if password is correct
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { user_id: user.id, mail: user.mail },
          process.env.TOKEN_KEY,
          {
            expiresIn: "30 days",
          }
        );

        // Update login token
        user = await dbController.putEntry(user.id, { token: token });
        if (!user.statut) res.status(500).send("Une erreur est survenue.");
        else res.status(200).send({ token });
      } else {
        res
          .status(400)
          .send("Votre identifiant ou votre mot de passe est incorrect.");
      }
    })
    .post("/signup", [authMiddleware, fieldsMiddleware], async (req, res) => {
      let user = null;
      let newUser = null;
      let encryptedPassword = null;
      const { mail, password, role } = req.fields;

      // Check required fields
      if (!(mail && password && role)) {
        res.status(400).send("Veuillez remplir tous les champs.");
      }

      // Check if user exists
      user = await dbController.searchEntry(
        mail,
        "id, mail, role",
        false,
        "mail"
      );
      if (!user.statut)
        res.status(500).send("Une erreur est survenue avec vos identifiants.");
      else if (user.results.length > 0)
        res.status(409).send("User already exists. Please login.");
      else encryptedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      newUser = await dbController.post({
        mail: mail.toLowerCase(),
        password: encryptedPassword,
        role: role,
      });
      if (!newUser.statut)
        res
          .status(500)
          .send(
            "Une erreur est survenue lors de l'enregistrement de votre compte utilisateur."
          );
      else if (
        newUser.results?.affectedRows &&
        newUser.results?.affectedRows > 0
      )
        res.status(200).send("Compte utilisateur enregistré.");
      else
        res
          .status(500)
          .send(
            "Une erreur est survenue lors de l'enregistrement de votre compte utilisateur."
          );
    });

  return router;
};
