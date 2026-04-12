import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, CardBody } from "react-bootstrap";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import "./../../admin/Analytics/analytics.scss";

function SellerDashboard() {
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalSales: 0,
    finishedOrders: 0,
    unfinishedOrders: 0,
    earnings: 0,
    dailyEarnings: [],
  });

  useEffect(() => {
    axios
      .get(config.server.uri + "seller/analytics", { withCredentials: true })
      .then((res) => {
        console.log(res);
        setStats(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Container className="">
      <Row className="mb-3">
        <Col>
          <h1 className="text-center text-warning">Analytics</h1>
        </Col>
      </Row>
      <Container>
        {" "}
        <Row>
          <Col md={3} className="p-2">
            <Card className="dashboard-card ">
              <Card.Body className="text-center">
                <i className="bi bi-cart-check dashboard-icon text-warning"></i>
                <Card.Title>Total Sales</Card.Title>
                <Card.Text>{stats.totalSales}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="p-2">
            <Card className="dashboard-card ">
              <Card.Body className="text-center">
                <i className="bi bi-cart-check dashboard-icon text-warning"></i>
                <Card.Title>Finished Orders</Card.Title>
                <Card.Text>{stats.finishedOrders}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="p-2">
            <Card className="dashboard-card ">
              <Card.Body className="text-center">
                <i className="bi bi-cart-check dashboard-icon text-warning"></i>
                <Card.Title>Unfinished Orders</Card.Title>
                <Card.Text>{stats.unfinishedOrders}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="p-2">
            <Card className="dashboard-card ">
              <Card.Body className="text-center">
                <i className="bi bi-cart-check dashboard-icon text-warning"></i>
                <Card.Title>Total Sales</Card.Title>
                <Card.Text>
                  {config.app.currency_symbol}
                  {stats.earnings}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={12} className="p-2">
            <Card className="graph-card">
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.dailyEarnings || []}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,0,0,0.08)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#6c757d", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "#6c757d", fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#ffc107"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default SellerDashboard;
