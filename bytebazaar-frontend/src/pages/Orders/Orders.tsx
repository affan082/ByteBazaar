import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card, Table } from "react-bootstrap";
import { OrderProps } from "../../interfaces/PropInterfaces";
import { ConfigContext } from "../../reducers/GlobalConfig";
import OrderModal from "../../components/OrderModal/OrderModal";
import "./Orders.scss";
import SpinnerComponent from "../../components/spinner/Spinner";

const OrderHistory = () => {
  const config = useContext(ConfigContext);
  const { id } = useParams<{ id: string }>();
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () =>{ 
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowModal(true);}
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<OrderProps[]>(`${config.server.uri}orders/${id}`);
        setOrders(response.data);
      } catch (error: any) {
        console.error("Error fetching orders:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  if (loading) {
    return <SpinnerComponent />;
  }

  return (
    <>
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <h2 className="title">
            Product <span>Order List</span>
          </h2>
          <p className="subtitle">Your product is our first priority</p>
        </div>

        {/* Pending Orders Section */}
        <Row className="g-4 mt-4 mx-2">
          <Col md={12}>
            <Card className="order-card">
              <Card.Title className="card-title">
                <h5>PENDING ORDERS</h5>
                <a href="/" type="button" className="shop-now-btn">
                  Shop Now
                </a>
              </Card.Title>
              <Card.Body className="order-card-body">
                <Table className="order-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Shipping</th>
                      <th>Quantity</th>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span>5454</span></td>
                      <td><span>Free</span></td>
                      <td><span>5</span></td>
                      <td><span>15/02/2025</span></td>
                      <td><span>{config.app.currency_symbol}67676</span></td>
                      <td className="pending-status"><span>Pending</span></td>
                      <td>
                        <span>
                          <a onClick={() => navigate(`/orders/OrderDetails`)} type="button" className="view-btn">
                            View
                          </a>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><span>1234</span></td>
                      <td><span>Free</span></td>
                      <td><span>10</span></td>
                      <td><span>22/03/2023</span></td>
                      <td><span>{config.app.currency_symbol}1000</span></td>
                      <td className="pending-status"><span>Pending</span></td>
                      <td>
                        <span>
                          <a onClick={() => navigate(`/orders/OrderDetails`)} type="button" className="view-btn">
                            View
                          </a>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Completed Orders */}
          <Col md={12}>
            <Card className="order-card">
              <Card.Title className="card-title">
                <h5>COMPLETE ORDERS</h5>
              </Card.Title>
              <Card.Body className="order-card-body">
                <Table className="order-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Shipping</th>
                      <th>Quantity</th>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                     <tr>
                      <td><span>31264</span></td>
                      <td><span>Free</span></td>
                      <td><span>3</span></td>
                      <td><span>15/02/2025</span></td>
                      <td><span>{config.app.currency_symbol}181.2</span></td>
                      <td className="completed-status"><span>Completed</span></td>
                      <td>
                        <span>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleOpen(); }} className="view-btn">View</a>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><span>98765</span></td>
                      <td><span>{config.app.currency_symbol}150</span></td>
                      <td><span>2</span></td>
                      <td><span>01/07/2023</span></td>
                      <td><span>{config.app.currency_symbol}360.5</span></td>
                      <td className="completed-status"><span>Completed</span></td>
                      <td>
                        <span>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleOpen(); }} className="view-btn">View</a>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <OrderModal showModal={showModal} handleClose={handleClose} />
    </>
  );
};

export default OrderHistory;

