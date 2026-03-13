const mongoose = require("mongoose");

const OrderStatus = {
    COMPLETE: "Completed",
    WAITING_DELIVERY: "Waiting for delivery",
    PENDING: "Pending",
    CANCELED: "Canceled",
    FAILED: "Failed",
    DELIVERED: "Delivered",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
};

const OrderSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: false,
        },
        sessionId: {
            type: String,
            required: true,
            unique: true, // ensures no duplicate session
        },
        customerEmail: {
            type: String,
            required: false, // might be useful for guest checkout
        },

        // Who placed the order (nullable for guest checkout)
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: process.env.MODEL_NAME_USER,
            required: false,
            default: null,
        },

        // Sellers involved in this order
        seller: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: process.env.MODEL_NAME_USER,
                required: true,
            },
        ],

        // Cart items in the order
        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: process.env.MODEL_NAME_PRODUCT,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],

        // Order pricing
        orderAmount: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        paidAmount: {
            type: Number,
            required: false,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            required: true,
            default: "PKR",
            uppercase: true,
        },

        // Payment info
        paymentMethod: {
            type: String,
            required: false,
        },

        // Order status
        status: {
            type: String,
            enum: OrderStatus, // safer than passing object directly
            default: OrderStatus.PENDING,
        },
    },
    { timestamps: true }
);

module.exports = {
    OrderStatus,
    Order: mongoose.model("Order", OrderSchema),
};
