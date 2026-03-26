const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const APIError = require("../utils/APIError");
const ErrorMessages = require("../config/ErrorMessages");
const APIResponse = require("../utils/APIResponse");
const {Order, OrderStatus} = require("../models/OrderSchema");
const {User} = require("../models/UserSchema");
const Product = require("../models/ProductSchema");
const jwt = require("jsonwebtoken");
const {orderConfirmationMail} = require("../utils/mailTemplate");
const {MailTransporter} = require("./mail_controller");

/**
 * Create Stripe Checkout Session + Save Pending Order
 */
exports.handlePaymentRequest = async function (req, res) {
    const MY_DOMAIN = `${process.env.FRONTEND_URL}`;
    let products = req.body.products;
    const user = req.user?.user || req.user;
    const guestInfo = req.body.guestInfo || {}; 

    if (!products || !products.length) {
        return res
            .status(400)
            .send(
                new APIError(
                    400,
                    "There is no product to purchase.",
                    ErrorMessages.PaymentErrors.EMPTY_CART
                )
            );
    }

    try {
        let session;
        try {
            session = await stripe.checkout.sessions.create({
                line_items: products.map((p) => ({
                    price: p.purchase_id,
                    quantity: p.quantity,
                })),
                mode: "payment",
                customer_email: user?.email || guestInfo?.email, // attach email for guest checkout
                success_url: `${MY_DOMAIN}/payment-completed?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${MY_DOMAIN}/payment-completed?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
            });
        } catch (err) {
            return res
                .status(400)
                .send(
                    new APIError(
                        400,
                        err.message,
                        ErrorMessages.StripeErrors.SESSION_CREATION_ERROR,
                        err
                    )
                );
        }



        // Save Incomplete Order in DB
        const sellers = [];
        products.forEach((p) => {
            if (!sellers.includes(p.seller)) sellers.push(p.seller);
            console.log(p)
        })
        const orderData = {
            buyer: user?._id || null, // logged-in user or null for guest
            sessionId: session.id,
            seller: sellers,
            cart: products.map((p) => ({
                product: p._id,
                quantity: p.quantity,
            })),
            shippingAddress: req.body.shippingAddress || guestInfo.shippingAddress || null,
            paymentMethod: "stripe",
            status: OrderStatus.PENDING,
            guestInfo: !user
                ? {
                    fullname: guestInfo.fullname,
                    email: guestInfo.email,
                    phone: guestInfo.phone,
                }
                : undefined,
        };

        try {
            await Order.create(orderData);
        } catch (err) {
            return res
                .status(500)
                .send(
                    new APIError(
                        500,
                        err.message,
                        ErrorMessages.OrderErrors.ORDER_CREATION_ERROR,
                        err
                    )
                );
        }

        return res
            .status(200)
            .send(
                new APIResponse(200, "The payment process has started.", {
                    sessionId: session.id,
                    redirect_url: session.url,
                })
            );
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .send(
                new APIError(
                    500,
                    err.message,
                    ErrorMessages.ServerErrors.INTERNAL_ERROR,
                    err
                )
            );
    }
};


/**
 * Handle Payment Success
 */
exports.handlePaymentSuccess = async function (req, res) {
    const { session_id } = req.query;
    if (!session_id) {
        return res
            .status(400)
            .send(
                new APIError(
                    400,
                    "The Stripe Session Id is missing",
                    ErrorMessages.StripeErrors.MISSING_SESSION_ID
                )
            );
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        const orderUpdate = {
            transactionId: session.payment_intent,
            paidAmount: session.amount_total,
            orderAmount: session.amount_subtotal,
            currency: session.currency,
            status: OrderStatus.WAITING_DELIVERY,
        };

        await Order.updateOne({ sessionId: session_id }, { $set: orderUpdate });

        const updatedOrder = await Order.findOne({ sessionId: session_id }).populate("cart.product");
        try {
            let buyerEmail = null;
            let buyerName = "Customer";

            if (updatedOrder?.buyer) {
                const buyer = await User.findById(updatedOrder.buyer).select("fullname email");
                buyerEmail = buyer?.email;
                buyerName = buyer?.fullname ?? "Customer";
            } else if (session.customer_email) {
                buyerEmail = session.customer_email;
                buyerName = "Customer";
            }
            if (buyerEmail) {
                const products = updatedOrder.cart.map(item => item.product);
                const mail = orderConfirmationMail(buyerName, updatedOrder, products);
                await MailTransporter.sendMail({
                    from: `${process.env.APPLICATION_NAME} <${process.env.SMTP_USERNAME}>`,
                    to: buyerEmail,
                    subject: mail.subject,
                    text: mail.text,
                });
            }
        } catch (mailErr) {
            console.error("Order confirmation mail failed:", mailErr.message);
        }

        return res.status(200).send(
            new APIResponse(200, "The Payment is Completed Successfully.", {
                transaction_id: session.payment_intent,
                order_id: updatedOrder?._id,
            })
        );
    } catch (err) {
        console.error("handlePaymentSuccess Error:", err);
        return res
            .status(500)
            .send(
                new APIError(
                    500,
                    err.message,
                    ErrorMessages.ServerErrors.INTERNAL_ERROR,
                    err
                )
            );
    }
};

/**
 * Handle Payment Cancel
 */
exports.handlePaymentCancel = async function (req, res) {
    const { session_id } = req.query;
    if (!session_id) {
        return res
            .status(400)
            .send(
                new APIError(
                    400,
                    "The Stripe Session Id is missing",
                    ErrorMessages.StripeErrors.MISSING_SESSION_ID
                )
            );
    }
    try {
        await Order.updateOne(
            { sessionId: session_id },
            { $set: { status: "canceled" } }
        );

        return res
            .status(200)
            .send(new APIResponse(200, "The Payment has been Canceled"));
    } catch (err) {
        return res
            .status(500)
            .send(
                new APIError(
                    500,
                    "There was an error canceling order.",
                    ErrorMessages.OrderErrors.PAYMENT_FAILED,
                    err
                )
            );
    }
};

/**
 * Stripe Product Management Helpers
 */
exports.registerProductToStripe = async (product_data) => {
    try {
        return await stripe.products.create({
            name: product_data.name,
            description: product_data.description,
            default_price_data: {
                unit_amount: (product_data.salePrice? product_data.salePrice : product_data.price) * 100,
                currency: process.env.DEFAULT_CURRENCY,
            },
            expand: ["default_price"],
        });
    } catch (err) {
        return undefined;
    }
};

exports.deleteProductFromStripe = async (purchase_id) => {
    try {
        return stripe.products.del(purchase_id);
    } catch (err) {
        return undefined;
    }
};

exports.updateProductFromStripe = async (purchase_id, product) => {
    try {
        if (!purchase_id) return undefined;

        return await stripe.products.update(purchase_id, {
            name: product.name,
            description: product.description,
            default_price_data: {
                unit_amount: product.price,
            },
        });
    } catch (err) {
        return undefined;
    }
};

exports.getStripeProduct = async (id) => {
    return id ? await stripe.products.retrieve(id) : undefined;
};
