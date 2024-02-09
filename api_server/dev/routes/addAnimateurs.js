const express = require("express");
const router = express.Router();

const fieldsMiddleware = require("../middleware/formidable");
const { authMiddleware } = require("../middleware/auth");
const bodyParser = require("body-parser");

const TIME_WINDOW_MS = 100;
router.use(bodyParser.json());

module.exports = (app, db) => {
  const dbController = require("../controllers/db")(db, "animations");
  const io = app.get("io");

  let isEmitting = false;
  let callCounter = 0;
  let timeoutId = null;

  const debounce = (func, wait) => {
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callCounter = 0;
        func.apply(this, args);
      }, wait);
    };
  };

  const throttleSubscribeAnimations = debounce(() => {
    if (!isEmitting) {
      callCounter++;
      if (callCounter === 1) {
        isEmitting = true;
        io.emit("subscribeAnimations");
        setTimeout(() => {
          isEmitting = false;
        }, TIME_WINDOW_MS);
      }
    }
  }, TIME_WINDOW_MS);

  const sendData = (statut, res, results, error, io = false) => {
    if (statut) {
      if (io) throttleSubscribeAnimations();
      res.status(200).send({ statut: "success", results: results });
    } else res.status(500).send({ statut: "failed", results: "API error" });
  };

  router.route("/addAnimateur").post((req, res) => {
    console.log("1");
    try {
      // Formater les données pour correspondre aux colonnes de la table
      const currentDate = new Date();
      const { nom, age, secteur, mobilite, appreciation, commentaire } =
        req.body;

      const sql = `INSERT INTO animateurs (nom,age, secteur,mobilite,appreciation,commentaire) VALUES ( '${nom}',  ${age},' ${secteur}', '${mobilite}',${appreciation},'${commentaire}')`;

      db.query(sql, (err, result) => {
        if (err) {
          res.status(404).json({ err });
          console.log(err);
          throw err;
        }
        const resultas = { statut: "success", error: err, results: result };

        res.status(200).json(resultas);
      });

      // Appeler le callback si fourni
      if (callback && typeof callback === "function") {
        callback(res);
      }

      // Retourner la réponse
      return res;
    } catch (err) {
      // En cas d'erreur, faire un rollback et retourner une réponse d'erreur
      db.rollback();
      const res = { statut: false, error: err, results: null };

      return res;
    }
  });
  return router;
};
