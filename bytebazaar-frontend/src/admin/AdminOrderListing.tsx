import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { ConfigContext } from "../reducers/GlobalConfig.tsx";
import "./admin_order_listing.scss";

interface OrderInterface {
  _id: string;
  buyer?: {
    fullname: string;
    email: string;
  };
  cart: {
    product: {
      _id: string;
      name: string;
      price: number;
      salePrice?: number;
    };
    quantity: number;
  }[];
  total?: number;
  status: string;
  createdAt: string;
  orderAmount?: number;
  paidAmount?: number;
  currency?: string;
  paymentMethod?: string;
}

function AdminOrderListing() {
  const config = useContext(ConfigContext);
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(config.server.uri + "orders", {
          withCredentials: true,
        });
        setOrders(res.data.data.reverse());
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === statusFilter.toLowerCase(),
        );
  return (
    <div className="admin-order-listing">
      <div className="mb-3">
        <h1 className="text-center text-warning">Orders List</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Canceled</option>
        </select>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <div className="order-list-wrapper">
          <div className="order-list-header">
            <span className="col hash">#</span>
            <span className="col id">Order ID</span>
            <span className="col buyer">Buyer</span>
            <span className="col total">Amount</span>
            <span className="col status">Status</span>
            <span className="col date">Date</span>
          </div>
          <div className="order-list-body">
            {filteredOrders.map((order, idx) => (
              <div key={order._id}>
                <div
                  className="order-row"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order._id ? null : order._id,
                    )
                  }
                >
                  <span className="col hash">{idx + 1}</span>
                  <span className="col id" title={order._id}>
                    {order._id.substring(0, 8)}...
                  </span>
                  <span className="col buyer">
                    {order.buyer
                      ? `${order.buyer.fullname} (${order.buyer.email})`
                      : "Guest"}
                  </span>
                  <span className="col total">{order.paidAmount || 0}</span>
                  <span className="col status">{order.status}</span>
                  <span className="col date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {expandedOrder === order._id && (
                  <div className="order-expanded">
                    <div>
                      <strong>Order ID:</strong> {order._id}
                    </div>

                    <div>
                      <strong>Buyer:</strong>{" "}
                      {order.buyer
                        ? `${order.buyer.fullname} (${order.buyer.email})`
                        : "Guest"}
                    </div>

                    <div>
                      <strong>Order Amount:</strong> {order.orderAmount}
                    </div>

                    <div>
                      <strong>Products:</strong>
                    </div>

                    {order.cart.map((item, i) => (
                      <div key={i}>
                        • {item.product?.name} × {item.quantity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrderListing;
