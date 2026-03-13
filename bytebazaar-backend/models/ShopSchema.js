const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // reference to seller user
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    businessType: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
    address: {
        type: String,
    },
    contactEmail: {
        type: String,
    },
    contactPhone: {
        type: String,
    },

    // Shop status
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Shop", ShopSchema);
