const mongoose = require("mongoose");

const PAYMENT_GATEWAYS = ["stripe"];
exports.PAYMENT_GATEWAYS = PAYMENT_GATEWAYS;

const ProductSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: false,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        manufacturer: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        shortDescription: {
            type: String,
            maxlength: 300,
        },
        description: {
            type: String,
            maxlength: 1500,
        },
        featureImage: {
            type: String,
        },
        gallery: {
            type: [String],
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        salePrice: {
            type: Number,
            min: 0,
            validate: {
                validator: function (v) {
                    return v === null || v <= this.price;
                },
                message: (props) =>
                    `Sale price (${props.value}) should be less than or equal to the regular price`,
            },
            default: 0,
        },
        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        stock: {
            type: Number,
            min: 0,
        },
        brand: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        paymentGateways: [
            {
                gateway: String,
                purchase_id: String,
            },
        ],
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        shopName: {
            type: String,
            required: true,
            trim: true,
        },
        status:{
            type:String,
            enum:["active","inactive"],
            default:"active"
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        }
    },
    { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", slug: "text" });

module.exports = mongoose.model(process.env.MODEL_NAME_PRODUCT, ProductSchema);
