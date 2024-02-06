const express = require("express");
const router = express.Router();

const fieldsMiddleware = require("../middleware/formidable");
const { authMiddleware } = require("../middleware/auth");

const TIME_WINDOW_MS = 100;

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

  router
    .route("/animations")
    .get((req, res) => {
      dbController.get(
        "*",
        ({ statut, error, results }) => sendData(statut, res, results, error),
        "animations"
      );
    })

    .post([authMiddleware, fieldsMiddleware], (req, res) => {
      const numberOfAnimations =
        req.body?.number || req.query?.number || req.cookies?.number;
      if (numberOfAnimations > 1) {
        let i = 0;
        let lastResult = null;
        let haveError = false;

        for (i; i < numberOfAnimations; i++) {
          dbController.post(req.fields, ({ statut, error, results }) => {
            lastResult = results;
            if (!statut) {
              haveError = error;
            }
          });

          if (haveError) break;
        }

        if (haveError) sendData(false, res, lastResult, haveError, io);
        else sendData(true, res, lastResult, false, io);
      } else {
        dbController.post(req.fields, ({ statut, error, results }) =>
          sendData(statut, res, results, error, io)
        );
      }
    });

  router
    .route("/animations/:id")
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
