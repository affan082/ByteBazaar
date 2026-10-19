const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");
const createAdmin = require("./utils/init_admin");
const app = express();
const PORT = process.env.PORT;
const connectString = process.env.MDB_URL;
const MongoStore = require("connect-mongo");


// Connect to MongoDB
mongoose.connect(connectString);


mongoose.connection.once("connected", () => {
  console.log("Mongoose connected successfully");
});

mongoose.connection.once("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.once("disconnected", () => {
  console.log("Mongoose disconnected");
});



// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(process.env.CONTENT_PATH));
// app.use(express.static(process.env.PUBLIC_PATH));
app.use(express.static(process.env.USER_CONTENT_DIR));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors());

const isProduction = process.env.STATUS === "production";
if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.SESSION_DB_URL,
  }),
  cookie: {
    maxAge: 1000 * 12 * 60 * 60,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    httpOnly: true,
  },
}))
app.use(router);
app.use((err, req, res, next) => {
  console.error("Server error:", err.message, err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
    errorCode: err.code || "SERVER_ERROR",
  });
});
// Cors


// Start the server
app.listen(PORT,async () => {
  console.log("Server Started on Port " + PORT);
  setTimeout(() => {
     createAdmin();
  }, 3000);
 
});
