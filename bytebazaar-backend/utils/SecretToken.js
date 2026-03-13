require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
    return jwt.sign({ id }, process.env.SESSION_SECRET_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
};