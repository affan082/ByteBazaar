// import { useState, useEffect } from 'react';
import { Button, Row, Col, Container, Card, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import "./orderdetails.scss";

const OrderDetails = () => {
  
  const navigate = useNavigate();

  return (
    <Container className="order-details-container">
      <Row>
        <Col className="order-title">
          <h4>My Orders Details</h4>
        </Col>
      </Row>

      <Row>
        {/* Address Info */}
        <Col md={3} className="address-info">
          <Card className="address-info-card">
            <Card.Body>
              <ul>
                <li><strong>Name:</strong><span>John Doe</span></li>
                <li><strong>Address:</strong><span>123 Main St</span></li>
                <li><strong>Postal Code:</strong><span>12345</span></li>
                <li><strong>Country:</strong><span>USA</span></li>
                <li><strong>State:</strong><span>California</span></li>
                <li><strong>City:</strong><span>Los Angeles</span></li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Items */}
        <Col md={9} className="order-items">
          <Card className="order-items-card">
            <div className="order-items-header">
              <Button onClick={() => navigate(-1)} className="back-button">
                <i className="bi bi-arrow-left" />
              </Button>
              <h5>Order Items</h5>
            </div>
            <Card.Body>
              <Table responsive className="order-items-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Price</th>
                  </tr>
                </thead>
                    <tbody>
                  <tr>
                    <td><span>1</span></td>
                    <td><span className="product-image"><img src="https://picsum.photos/200" alt="Product" /></span></td>
                    <td><span>dummy product</span></td>
                    <td><span>2022-01-01</span></td>
                    <td><span>$1000</span></td>
                  </tr>
                  <tr>
                    <td><span>2</span></td>
                    <td><span className="product-image"><img src="https://picsum.photos/200" alt="Product" /></span></td>
                    <td><span>dummy product</span></td>
                    <td><span>2022-01-01</span></td>
                    <td><span>$1000</span></td>
                  </tr>
                  <tr>
                    <td><span>3</span></td>
                    <td><span className="product-image"><img src="https://picsum.photos/200" alt="Product" /></span></td>
                    <td><span>dummy product</span></td>
                    <td><span>2022-01-01</span></td>
                    <td><span>$1000</span></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;

