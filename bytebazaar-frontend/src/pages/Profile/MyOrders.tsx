import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Col, Container, Row, Spinner } from "react-bootstrap";
// import { Order } from "../../types";
import { Order } from "../../interfaces/OrderInterface.tsx";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import "./styles/my-orders.scss";
import "./MyOrder.scss";

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const config = useContext(ConfigContext);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get<{ data: Order[] }>(
          config.server.uri + "orders",
          {
            withCredentials: true,
          },
        );
        setOrders(res.data.data || []);
        // console.log(res.data.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    console.log(orders);
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <Spinner animation="border" variant="warning" />
        <h3 className="mt-2 text-warning">Loading your orders...</h3>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h3 className="mb-4">New Orders</h3>
        <p>You don’t have any new orders right now.</p>
      </div>
    );
  }

  return (
    <Container fluid className="my-orders-listing">
      <Row className="mb-3">
        <Col>
          <h1 className="text-center text-warning">My Orders</h1>
        </Col>
      </Row>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <div className="order-list-wrapper">
          <Row className="order-list-header">
            <Col md={6} lg={6} className="col products">
              Products
            </Col>
            <Col md={2} lg={2} className="col amount">
              Amount
            </Col>
            <Col md={2} lg={2} className="col status">
              Status
            </Col>
            <Col md={2} lg={2} className="col date">
              Date
            </Col>
          </Row>
          <div className="order-list-body">
            {orders.map((order) => (
              <div key={order._id}>
                <Row className="order-row">
                  <Col className="col products">
                    {order.cart.map((item, index) => (
                      <div key={index} className="d-flex align-items-left mb-2">
                        <img
                          src={`${config.server.uri}${item.product.featureImage}`}
                          alt={item.product.name}
                          width="50"
                          height="50"
                          style={{ objectFit: "cover", marginRight: "5px" }}
                        />
                        <div className="t-length">{item.product.name}</div>
                      </div>
                    ))}
                  </Col>
                  <Col md={2} lg={2} className="col amount">
                    Rs.{order.orderAmount / 100}
                  </Col>
                  <Col md={2} lg={2} className="col status">
                    {order.status}
                  </Col>
                  <Col md={2} lg={2} className="col date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}

export default MyOrders;
