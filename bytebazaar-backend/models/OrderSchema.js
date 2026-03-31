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
            unique: true,
        },
        customerEmail: {
            type: String,
            required: false, 
        },
      
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: process.env.MODEL_NAME_USER,
            required: false,
            default: null,
        },
      
        seller: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: process.env.MODEL_NAME_USER,
                required: true,
            },
        ],

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

        paymentMethod: {
            type: String,
            required: false,
        },

        status: {
            type: String,
            enum: OrderStatus, 
            default: OrderStatus.PENDING,
        },
    },
    { timestamps: true }
);

module.exports = {
    OrderStatus,
    Order: mongoose.model("Order", OrderSchema),
};
