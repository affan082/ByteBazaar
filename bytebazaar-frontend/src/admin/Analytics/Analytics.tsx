import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./analytics.scss";

interface DailyEarning {
  date: string;
  sales: number;
  earnings: number;
}

interface AnalyticsData {
  totalSales: number;
  finishedOrders: number;
  unfinishedOrders: number;
  earnings: number;
  dailyEarnings: DailyEarning[];
}

const Analytics: React.FC = () => {
  const config = useContext(ConfigContext);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(config.server.uri + "analytics", {
          withCredentials: true,
        });
        setAnalytics(res.data.data);
      } catch (err: any) {
        console.error("Analytics error:", err);
        setError(err.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <Spinner animation="border" variant="warning" />
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h1 className="text-center text-warning">Analytics</h1>
        </Col>
      </Row>
      {analytics && (
        <Container>
          <Row>
            <Col md={3} className="p-2">
              <Card className="dashboard-card ">
                <Card.Body className="text-center">
                  <i className="bi bi-cart-check dashboard-icon text-warning"></i>
                  <Card.Title>Total Sales</Card.Title>
                  <Card.Text>{analytics.totalSales}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="p-2">
              <Card className="dashboard-card">
                <Card.Body className="text-center">
                  <i className="bi bi-check-circle dashboard-icon text-warning"></i>
                  <Card.Title>Finished Orders</Card.Title>
                  <Card.Text>{analytics.finishedOrders}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="p-2">
              <Card className="dashboard-card ">
                <Card.Body className="text-center">
                  <i className="bi bi-hourglass-split dashboard-icon text-warning"></i>
                  <Card.Title>Unfinished Orders</Card.Title>
                  <Card.Text>{analytics.unfinishedOrders}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="p-2">
              <Card className="dashboard-card ">
                <Card.Body className="text-center">
                  <i className="bi bi-cash-coin dashboard-icon text-warning"></i>
                  <Card.Title>Total Earnings</Card.Title>
                  <Card.Text>{analytics.earnings}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12} className="p-2">
              <Card className="graph-card">
                <Card.Body>
                  <h5 className="mb-3">Daily Earnings Overview</h5>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.dailyEarnings}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.08)"
                      />

                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#6c757d", fontSize: 12 }}
                        interval={1}
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
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </Container>
  );
};

export default Analytics;
