const session = require("express-session");
//const Mongoose = require("mongoose");
const MongoStore = require("connect-mongodb-session")(session);

var store = new MongoStore({
  uri: process.env.DB_URL,
  collection: process.env.SESSION_COLL,
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

const Session = {
  secret: process.env.SESSION_SECRET_KEY,
  cookie: {
    maxAge: 1000 * 12 * 60 * 60,
  },
  resave: false,
  saveUninitialized: true,
  store: store,
};

module.exports = Session;
