const express = require("express");
const router = express.Router();

const fieldsMiddleware = require("../middleware/formidable");
const { authMiddleware } = require("../middleware/auth");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

module.exports = (app, db) => {
  const dbController = require("../controllers/db")(db, "lieux");
  const io = app.get("io");

  const sendData = (statut, res, results, error, io = false) => {
    if (statut) {
      if (io) io.emit("subscribeLieux");
      res.status(200).send({ statut: "success", results: results });
    } else res.status(500).send({ statut: "failed", results: "API error" });
  };

  router
    .route("/lieux")
    .get(authMiddleware, (req, res) => {
      dbController.get("*", ({ statut, error, results }) =>
        sendData(statut, res, results, error)
      );
    })
    .post([authMiddleware, fieldsMiddleware], (req, res) => {
      console.log("req");
      console.log(req.body);
      dbController.post(req.body, ({ statut, error, results }) =>
        sendData(statut, res, results, error, io)
      );
    });

  router
    .route("/lieux/:id")
    .get(authMiddleware, (req, res) => {
      dbController.searchEntry(
        req.params.id,
        "*",
        ({ statut, error, results }) => sendData(statut, res, results, error)
      );
    })
    .put([authMiddleware, fieldsMiddleware], (req, res) => {
      dbController.putEntry(
        req.params.id,
        req.fields,
        ({ statut, error, results }) =>
          sendData(statut, res, results, error, io)
      );
    })
    .delete(authMiddleware, (req, res) => {
      const sendDataAfter =
        req.body?.resend || req.query?.resend || req.cookies?.resend;
      const ioSend = sendDataAfter === "true" ? io : false;
      dbController.deleteEntry(req.params.id, ({ statut, error, results }) =>
        sendData(statut, res, results, error, ioSend)
      );
    });

  return router;
};
