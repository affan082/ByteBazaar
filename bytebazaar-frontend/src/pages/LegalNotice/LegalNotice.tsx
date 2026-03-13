import { Container, Row, Col } from "react-bootstrap";
function LegalNotice() {
  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col md={{ offset: 5 }}>
            <h1>Notice</h1>
          </Col>
        </Row>

        <p className="fs-5">
          Welcome to ByteBazaar! ByteBazaar is committed to ensuring a
          transparent and trustworthy shopping experience for all our customers.
          This Legal Notice outlines important legal information about our
          operations, terms of use, and customer rights. By accessing or using
          our website, you agree to comply with the policies described below.
          ByteBazaar operates in compliance with all applicable laws and
          regulations, ensuring the highest standards in customer service,
          product quality, and privacy protection. Your privacy is our priority.
          ByteBazaar collects, processes, and stores personal data in accordance
          with our Privacy Policy
          <h3 className="mt-3">Terms of use:</h3>
          <ul>
            <li className="m-2">
              Access to Services: By using ByteBazaar, you confirm that you are
              at least 18 years old or have the consent of a legal guardian.
            </li>
            <li className="m-2">
              Intellectual Property: All content, images, and trademarks
              displayed on ByteBazaar are the property of ByteBazaar or its
              respective partners and may not be used without prior
              authorization.
            </li>
            <li className="m-2">
              Prohibited Activities: Users are prohibited from engaging in
              fraudulent, illegal, or unauthorized activities while using our
              platform.
            </li>
          </ul>
          <h3 className="m-1">Disclaimer of Liability:</h3>ByteBazaar is not
          responsible for:
          <ul>
            <li className="m-2">
              Errors in product descriptions or pricing due to unforeseen
              technical issues.
            </li>
            <li className="m-2">
              Delays in delivery caused by third-party carriers or unforeseen
              events.
            </li>
            <li className="m-2">
              Any loss or damage arising from the use of our website outside of
              legal guarantees.
            </li>
          </ul>
        </p>

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
export default LegalNotice;
