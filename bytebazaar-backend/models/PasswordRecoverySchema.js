const { default: mongoose, model } = require("mongoose");

const passwordRecoverySchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    email: String,
    recoveryCode: String,
});

module.exports = mongoose.model("PasswordRecoverySchema", passwordRecoverySchema);
