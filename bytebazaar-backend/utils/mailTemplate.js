function orderConfirmationMail(buyerName, order, products) {
  const itemLines = products.map((product, index) => {
    const quantity = order.cart[index]?.quantity ?? 1;
    const price = product?.salePrice > 0 ? product.salePrice : product?.price ?? 0;
    return `  - ${product?.name ?? "Product"} x${quantity}  =>  PKR ${price * quantity}`;
  }).join("\n");

  return {
    subject: "Order Confirmation - Your Order Has Been Placed",
    text: `
Hello ${buyerName},

Thank you for your order! Here are your order details:

----------------------------------------
ORDER ID     : ${order._id}
DATE         : ${new Date(order.createdAt).toDateString()}
STATUS       : ${order.status}
----------------------------------------

ITEMS ORDERED:
${itemLines}

----------------------------------------
ORDER TOTAL  : PKR ${order.orderAmount}
----------------------------------------

We will notify you once your order will be completed.

Regards,
${process.env.APPLICATION_NAME}
    `.trim()
  };
}

function orderCompletedMail(buyerName, order) {
  return {
    subject: "Your Order Has Been Completed!",
    text: `
Hello ${buyerName},

Great news! Your order has been marked as Completed.

----------------------------------------
ORDER ID     : ${order._id}
DATE         : ${new Date(order.createdAt).toDateString()}
TOTAL PAID   : PKR ${order.paidAmount ?? order.orderAmount}
STATUS       : ${order.status}
----------------------------------------

Thank you for shopping with us. We hope to see you again!

Regards,
${process.env.APPLICATION_NAME}
    `.trim()
  };
}

module.exports = { orderConfirmationMail, orderCompletedMail };