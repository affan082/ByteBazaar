import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Image,
  Button,
} from "react-bootstrap";
import "./userprofile.scss";
import { Link } from "react-router-dom";

function UserProfile() {
  return (
    <Container className="main-container">
      <Row>
        <Col md={3} xs={12}>
          <div className="sidebar">
            <ListGroup className="list">
              <ListGroup.Item action as={Link} to="/userprofile">
                User Profile
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/userhistory">
                User History
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/cart">
                Cart
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/checkout">
                Checkout
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/trackorder">
                Track Orders
              </ListGroup.Item>
              <ListGroup.Item action as={Link} to="/invoice">
                Invoice
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>
        <Col md={9} xs={12} className="text-center">
          <Card className="profile-card">
            <div className="profile-bg">
              <Image src="#" className="bg-image" />
            </div>
            <div className="profile-content">
              <div className="profile-info">
                <Image src="#" className="profile-image" />
                <div>
                  <h5 className="user-name">affan amin</h5>
                  <p className="user-bio">anything</p>
                </div>
              </div>
              <Button variant="warning" className="edit-btn">
                Edit
              </Button>
            </div>
          </Card>
          <Card className="acc-info">
            <Card.Title className="info-title">Account Information</Card.Title>
            <Card.Body>
              <Row>
                <Col md={6} xs={12}>
                  <p className="info-text">
                    <strong>Email Address:</strong>
                    <hr />
                    example@gmail.com
                  </p>
                </Col>
                <Col md={6} xs={12}>
                  <p className="info-text">
                    <strong>Contact Number:</strong>
                    <hr />
                    123456789
                  </p>
                </Col>
              </Row>
              <Row>
                <p className="info-text">
                  <strong>Address:</strong>
                  <hr />
                  Govt Islamia Graduate College
                </p>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default UserProfile;
