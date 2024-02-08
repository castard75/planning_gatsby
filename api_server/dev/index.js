const app = require("express")();
const mysql = require("mysql");
const { createServer } = require("http");
const httpServer = createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  serveClient: false,
  cors: {
    origin: "*",
  },
});

/* ******************************************************************* */
/* *********************** MIDDLEWARE & ROUTES *********************** */
/* ******************************************************************* */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const { ioAuth, corsAuth } = require("./middleware/auth");
const authRouter = require("./routes/auth");
const animationsRouter = require("./routes/animations");
const addAnimationsRouter = require("./routes/addAnimations");
const addLieuxRouter = require("./routes/addLieux");
const animateursRouter = require("./routes/animateurs");
const clientsRouter = require("./routes/clients");
const lieuxRouter = require("./routes/lieux");

/* ********************************************************* */
/* *********************** DATABASE ************************ */
/* ********************************************************* */

const db_config = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "planning",
};

var db = null;

function handleDisconnect() {
  db = mysql.createConnection(db_config);
  db.connect((err) => {
    if (err) {
      console.log("> Error when connecting to Database : ", err);
      setTimeout(handleDisconnect, 2000);
    } else console.log("> SQL Database Ready");
  });

  db.on("error", function (err) {
    console.log("> Database Error : ", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("> Reconnecting to Database...");
      handleDisconnect();
    } else throw err;
  });
}

handleDisconnect();
setInterval(() => {
  db !== null ? db.query("SELECT 1") : null;
}, 5000);

/* **************************************************************** */
/* *************************** API ROUTES ************************* */
/* **************************************************************** */

app
  .set("io", io)
  .use("/auth", authRouter(db))
  .use("/api", animationsRouter(app, db))
  .use("/api", animateursRouter(app, db))
  .use("/api", addAnimationsRouter(app, db))
  .use("/api", clientsRouter(app, db))
  .use("/api", lieuxRouter(app, db))
  .use("/api", addLieuxRouter(app, db))
  .route("*")
  .all((req, res, next) => {
    res.sendStatus(404);
  });

/* **************************************************************** */
/* *************************** SOCKET IO ************************** */
/* **************************************************************** */

io.on("connection", (socket) => {
  console.log(socket.id);
  ioAuth(socket, io);
});

/* **************************************************************** */
/* *************************** SERVER START ************************ */
/* **************************************************************** */

httpServer.listen(3000, "localhost", (err) => {
  if (err) throw err;
  console.log(`> Server Ready`);
});
