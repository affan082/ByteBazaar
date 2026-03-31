// const {Product} = require("../models/ProductSchema");
const APIError = require("../utils/APIError");
const APIResponse = require("../utils/APIResponse");
const ErrorMessages = require("../config/ErrorMessages.json");
const {User} = require("../models/UserSchema");
// const Product = require("../models/ProductSchema");
const {Order, OrderStatus} = require("../models/OrderSchema");
const { orderConfirmationMail, orderCompletedMail } = require("../utils/mailTemplate");
const { MailTransporter } = require("./mail_controller");



exports.createOrder = async (req, res) => {
    try {
        const user = req.user?.user || req.user;
        if (!user) return res.status(401).send(new APIError(401, "Unauthorized"));
        const dbUser = await User.findById(user._id).populate("roles");
        if (!dbUser) return res.status(404).send(new APIError(404, "User not found"));

        const roleNames = dbUser.roles.map((r) => r.name);

        if (!roleNames.includes("buyer")) {
            return res.status(403).send(new APIError(403, "Only buyers can create orders"));
        }

        const { items, shippingAddress, paymentMethod } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).send(new APIError(400, "Order items are required"));
        }

        const order = new Order({
            buyer: dbUser._id,
            cart: items,
            shippingAddress,
            paymentMethod,
            status: "pending",
        });

        const savedOrder = await order.save();
        
       
        res.status(201).send(new APIResponse(201, "Order created successfully", savedOrder));
    } catch (err) {
        console.error("Create Order Error:", err);
        res
            .status(500)
            .send(new APIError(500, "Failed to create order", ErrorMessages.ServerErrors.INTERNAL_ERROR));
    }
};


exports.getOrders = async (req, res) => {
    try {
        const user = req.user?.user || req.user;
        if (!user) return res.status(401).send(new APIError(401, "Unauthorized"));

        const dbUser = await User.findOne({_id:user._id}).populate("roles");
        if (!dbUser) return res.status(404).send(new APIError(404, "User not found"));

        const roleNames = dbUser.roles.map((r) => r.name);
        let orders;

        if (roleNames.includes("buyer")) {
            orders = await Order.find({ buyer: dbUser._id })
                .populate("cart.product")
                .populate("buyer", "fullname email");
        } else if (roleNames.includes("seller")) {
            orders = await Order.find({ seller: dbUser._id })
                .populate("cart.product")
                .populate("buyer", "fullname email");
        } else if (roleNames.includes("administrator")) {
            orders = await Order.find()
                .populate("cart.product")
                .populate("buyer", "fullname email");
        } else {
            return res
                .status(403)
                .send(new APIError(403, "You do not have permission to view orders"));
        }
        res.status(200).send(new APIResponse(200, "Orders fetched successfully", orders));
    } catch (err) {
        console.error("Get Orders Error:", err);
        res
            .status(500)
            .send(new APIError(500, "Failed to get orders", ErrorMessages.ServerErrors.INTERNAL_ERROR));
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res
                .status(401)
                .send(new APIError(401, "Unauthorized", ErrorMessages.UserAuthErrors.UNAUTHORIZED_ACCESS));
        }

        const allowedStatuses = Object.values(OrderStatus);
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send(new APIError(400, "Invalid order status"));
        }

        const order = await Order.findById(id).populate("seller", "fullname email");

        if (!order) {
            return res.status(404).send(new APIError(404, "Order not found"));
        }

        if (!order.seller.some(s => s.equals(userId))) {
            return res.status(403).send(new APIError(403, "You are not authorized to update this order"));
        }

        order.status = status;
        await order.save();

        if (status === OrderStatus.COMPLETE) {
        try {
            const buyer = await User.findById(order.buyer).select("fullname email");
            if (buyer?.email) {
            const mail = orderCompletedMail(buyer.fullname, order);
            await MailTransporter.sendMail({
                from: `${process.env.APPLICATION_NAME} <${process.env.SMTP_USERNAME}>`,
                to: buyer.email,
                subject: mail.subject,
                text: mail.text,
            });
            }
        } catch (mailErr) {
            console.error("Order completed mail failed:", mailErr);
        }
        }

        return res
            .status(200)
            .send(new APIResponse(200, "Order status updated successfully", order));
    } catch (err) {
        console.error("Order status update error:", err);
        return res
            .status(500)
            .send(new APIError(500, "Failed to update order status", err.message));
    }
};


exports.deleteOrder = async (req, res) => {
    try {
        const user = req.user?.user || req.user;
        if (!user) return res.status(401).send(new APIError(401, "Unauthorized"));

        const dbUser = await User.findById(user._id).populate("roles");
        if (!dbUser) return res.status(404).send(new APIError(404, "User not found"));

        const roleNames = dbUser.roles.map((r) => r.name);

        if (!roleNames.includes("administrator")) {
            return res.status(403).send(new APIError(403, "Only admins can delete orders"));
        }

        const { id } = req.params;
        const deleted = await Order.findByIdAndDelete(id);
        if (!deleted) return res.status(404).send(new APIError(404, "Order not found"));

        res.status(200).send(new APIResponse(200, "Order deleted successfully", deleted));
    } catch (err) {
        console.error("Delete Order Error:", err);
        res
            .status(500)
            .send(new APIError(500, "Failed to delete order", ErrorMessages.ServerErrors.INTERNAL_ERROR));
    }
};


exports.getCustomersForSeller = async (req, res) => {
    try {
        const seller = req.user?.user || req.user;
        if (!seller) {
            return res
                .status(401)
                .send(
                    new APIError(
                        401,
                        "Unauthorized",
                        "UNAUTHORIZED_ACCESS",
                        ErrorMessages.UserAuthErrors.UNAUTHORIZED_ACCESS
                    )
                );
        }

        const orders = await Order.find({ seller: seller._id })
            .populate("buyer", "fullname email phone")
            .select("buyer");

        if (!orders.length) {
            return res
                .status(404)
                .send(new APIResponse(404, "No customers found", []));
        }

        const uniqueCustomersMap = new Map();
        orders.forEach((order) => {
            if (order.buyer && !uniqueCustomersMap.has(order.buyer._id.toString())) {
                uniqueCustomersMap.set(order.buyer._id.toString(), order.buyer);
            }
        });

        const customers = Array.from(uniqueCustomersMap.values());

        return res
            .status(200)
            .send(
                new APIResponse(200, "Customers fetched successfully", customers)
            );
    } catch (err) {
        console.error("Get Customers Error:", err);
        return res
            .status(500)
            .send(
                new APIError(
                    500,
                    "Failed to get customers",
                    "INTERNAL_ERROR",
                    err
                )
            );
    }
};

exports.generateAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ seller: sellerId }).populate("cart.product").lean();

    if (!orders.length) {
      return res.status(200).send(
        new APIResponse(200, "No analytics yet", {
          totalSales: 0,
          finishedOrders: 0,
          unfinishedOrders: 0,
          earnings: 0,
          dailyEarnings: [],
        })
      );
    }

    let totalItemsSold = 0;
    let totalRevenue = 0;
    let finishedOrders = 0;

    const dailyMap = {};

    orders.forEach(order => {

      if (order.status === OrderStatus.COMPLETE) {
        finishedOrders++;
      }

      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];

      if (!dailyMap[orderDate]) {
        dailyMap[orderDate] = {
          date: orderDate,
          sales: 0,
          earnings: 0
        };
      }

      order.cart.forEach(item => {
        const product = item.product;

        if (!product) return;

        if (product.seller.toString() === sellerId.toString()) {

          const price = product.salePrice > 0 
            ? product.salePrice 
            : product.price;

          const qty = item.quantity;

          totalItemsSold += qty;
          totalRevenue += price * qty;

          dailyMap[orderDate].sales += qty;
          dailyMap[orderDate].earnings += price * qty;
        }
      });
    });

    const dailyEarnings = Object.values(dailyMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const analytics = {
      totalSales: totalItemsSold,        
      finishedOrders,
      unfinishedOrders: orders.length - finishedOrders,
      earnings: totalRevenue,
      dailyEarnings
    };

    return res
      .status(200)
      .send(new APIResponse(200, "Analytics fetched", analytics));

  } catch (err) {
    console.error("Analytics Error:", err);
    return res.status(500).send(
      new APIError(500, "Failed to generate analytics", "INTERNAL_ERROR")
    );
  }
};

