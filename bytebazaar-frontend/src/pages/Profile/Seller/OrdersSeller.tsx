import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../../reducers/UserContext";
import axios from "axios";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import config from "../../../config/global-info.json";
import "./ordersSeller.scss";

interface Order {
  _id: string;
  buyer: {
    fullname: string;
    email: string;
  };
  paidAmount: number;
  status: string;
  createdAt: string;
  cart: {
    product: { name: string };
    quantity: number;
  }[];
}

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

function OrdersSeller() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const sellerStatus = user?.sellerProfile?.status;

  if (sellerStatus !== "verified") {
    return (
      <Container className="orders-seller py-5">
        <Alert variant="warning">
          <Alert.Heading>⏳ Account Not Verified</Alert.Heading>
          <p className="mb-0">
            You need to be verified by an administrator before accessing orders.
            Your account is currently <strong>{sellerStatus}</strong>.
          </p>
        </Alert>
      </Container>
    );
  }

  // Fetch orders
  useEffect(() => {
    setLoading(true);
    axios
      .get(config.server.uri + config.server.api.get_orders_seller, {
        withCredentials: true,
      })
      .then((res) => {
        setOrders(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
  }, []);

  // Open modal with order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setShowModal(true);
  };

  // Update order status
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      await axios.put(
        `${config.server.uri}orders/${selectedOrder._id}/status`,
        { status },
        { withCredentials: true },
      );

      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? { ...o, status } : o)),
      );

      setShowModal(false);
    } catch (err) {
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Container className="orders-seller ">
      <h1 className="text-center text-warning mb-4">My Orders</h1>
      {loading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" variant="warning" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && orders.length === 0 && (
        <p>You don’t have any orders yet.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="order-list-wrapper">
          <div className="order-list-header">
            <span className="col buyer">Buyer</span>
            <span className="col product-count">Product Count</span>
            <span className="col total-ammount">Total Amount</span>
            <span className="col status">Status</span>
            <span className="col date">Date</span>
            <span className="col action">Action</span>
          </div>
          <div className="order-list-body">
            {orders.map((order) => (
              <div key={order._id} className="order-row">
                <span className="col buyer">
                  {order.buyer?.fullname || "Unknown"}
                </span>
                <span className="col product-count">
                  {order.cart?.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
                <span className="col total-ammount">
                  Rs. {order.paidAmount}
                </span>
                <span className="col status">{order.status}</span>
                <span className="col date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="col action">
                  <Button
                    variant="c-btn"
                    size="sm"
                    className="c-btn"
                    onClick={() => handleViewOrder(order)}
                  >
                    View
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p>
                <strong>Order Id : </strong>
                <span>{selectedOrder._id}</span>
              </p>
              <h5>Buyer Info</h5>
              <p>
                <strong>{selectedOrder.buyer?.fullname}</strong> (
                {selectedOrder.buyer?.email})
              </p>

              <h5>Products</h5>
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.cart?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.product?.name || "Unnamed Product"}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h5 className="mt-3">Update Status</h5>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {Object.values(OrderStatus).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </Form.Select>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="success"
            disabled={updating}
            onClick={handleUpdateStatus}
          >
            {updating ? "Updating..." : "Update Status"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default OrdersSeller;
