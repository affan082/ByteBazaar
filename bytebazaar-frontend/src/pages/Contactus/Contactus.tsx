import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

import "./contactus.scss";

const ContactUs = () => {
  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">
        Get In <span className="text-warning">Touch</span>
      </h2>
      <p className="text-center mb-5">
        Please select a method below related to your inquiry. If you don't find
        what you need, fill out our contact form.
      </p>
      <Row className="justify-content-center">
        <Col md={4} className="mb-4">
          <Card className="custom-card">
            <Card.Body className="text-center text-dark">
              <div className="mt-3">
                <i className="bi-envelope-fill fs-1 "></i>
              </div>
              <Card.Title>Mail</Card.Title>

              <p>
                <i className="bi-envelope-fill">&nbsp;&nbsp;</i>
                <a
                  className="text-reset text-decoration-none"
                  href="mailto:mail.info@bytebazaar.com"
                >
                  info@bytebazaar.com
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="custom-card">
            <Card.Body className="text-center text-dark">
              <div className="mt-3">
                <i className="bi-phone-fill fs-1 "></i>
              </div>
              <Card.Title>Contact</Card.Title>
              <p>
                <i className="bi-phone-fill "></i>&nbsp;&nbsp;+92-325-752-4473
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="custom-card">
            <Card.Body className="text-center text-dark">
              <div className="mt-3">
                <i className="bi-geo-alt-fill fs-1"></i>
              </div>
              <Card.Title>Address</Card.Title>

              <p>
                <i className="bi-geo-alt-fill "></i>&nbsp;&nbsp;Gujranwala,
                Pakistan
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="my-5 justify-content-center">
        <Col>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group className="my-4" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="my-4" controlId="formBasicPhone">
              <Form.Control type="tel" placeholder="Enter phone number" />
            </Form.Group>
            <Form.Group className="my-4" controlId="formBasicMessage">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your message"
              />
            </Form.Group>
            <Button className="mt-2" variant="warning" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
