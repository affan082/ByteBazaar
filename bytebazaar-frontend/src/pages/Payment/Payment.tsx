import { Container, Row, Col, Accordion } from "react-bootstrap";
function Payment() {
  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col md={{ offset: 5 }}>
            <h1>Payment</h1>
          </Col>
        </Row>

        <p className="fs-5">
          We provide a variety of payment methods for your convenience. Choose
          the one that best suits your needs.
          <h3 className="m-3">Accepted Payment Methods:</h3>
          <ul>
            <li>VisaCard</li>
            <li>MasterCard</li>
            <li>PayPal</li>
            <li>Easypaisa</li>
            <li>Bank Transfers</li>
          </ul>
          Secure Transactions Your payment information is encrypted and
          processed securely using industry-leading technologies to ensure your
          data is protected.
        </p>
        <h3 className="m-3">FAQs:</h3>
        <Accordion className="m-4" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              What happens if my payment fails?
            </Accordion.Header>
            <Accordion.Body>
              In case of a failed payment, please try again or contact our
              support team for assistance.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>How do I request a refund?</Accordion.Header>
            <Accordion.Body>
              Refunds can be requested by contacting our support team or through
              the order history page in your account.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Row className="m-4,">
          <Col md={{ offset: 4 }}>
            <h5>Contact Us For inquiries, feel free to reach out:</h5>
          </Col>
        </Row>
        <Row className="m-3">
          <Col
            xs={6}
            className="d-flex align-items-center justify-content-center"
          >
            <h5> Email: info@bytebazaar.com</h5>
          </Col>
          <Col
            xs={6}
            className="d-flex align-items-center justify-content-center"
          >
            <h5>Phone: +92-325-752-4473</h5>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Payment;
