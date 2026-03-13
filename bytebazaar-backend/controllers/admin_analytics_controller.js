const { Order, OrderStatus } = require("../models/OrderSchema");
const APIResponse = require("../utils/APIResponse");
const APIError = require("../utils/APIError");

exports.generateAdminAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().populate("cart.product").lean();

    if (!orders.length) {
      return res.status(200).send(
        new APIResponse(200, "No analytics yet", {
          totalSales: 0,
          finishedOrders: 0,
          unfinishedOrders: 0,
          earnings: 0,
          dailyEarnings: [],
          topSellers: []
        })
      );
    }

    let totalItemsSold = 0;
    let totalRevenue = 0;
    let finishedOrders = 0;

    const dailyMap = {};
    const sellerMap = {};

    orders.forEach(order => {
      if (order.status === OrderStatus.COMPLETE) finishedOrders++;

      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];

      if (!dailyMap[orderDate]) dailyMap[orderDate] = { date: orderDate, sales: 0, earnings: 0 };

      order.cart.forEach(item => {
        const product = item.product;
        if (!product) return;

        const price = product.salePrice || product.price;
        const qty = item.quantity;

        totalItemsSold += qty;
        totalRevenue += price * qty;

        dailyMap[orderDate].sales += qty;
        dailyMap[orderDate].earnings += price * qty;

        const sellerId = product.seller.toString();
        if (!sellerMap[sellerId]) sellerMap[sellerId] = { seller: sellerId, earnings: 0, sales: 0 };

        sellerMap[sellerId].earnings += price * qty;
        sellerMap[sellerId].sales += qty;
      });
    });

    const dailyEarnings = Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date));
    const topSellers = Object.values(sellerMap).sort((a, b) => b.earnings - a.earnings).slice(0, 5);

    const analytics = {
      totalSales: totalItemsSold,
      finishedOrders,
      unfinishedOrders: orders.length - finishedOrders,
      earnings: totalRevenue,
      dailyEarnings,
      topSellers
    };

    return res.status(200).send(new APIResponse(200, "Admin analytics fetched", analytics));
  } catch (err) {
    console.error("Admin Analytics Error:", err);
    return res.status(500).send(new APIError(500, "Failed to generate admin analytics", "INTERNAL_ERROR"));
  }
};
