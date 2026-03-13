import { Container, Row, Col, Accordion } from "react-bootstrap";
function Delivery() {
  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col md={{ offset: 5 }}>
            <h1>Delivery</h1>
          </Col>
        </Row>

        <p className="fs-5">
          Packages are generally dispatched within 2 days after receipt of
          payment and are shipped via TCS with tracking and drop-off without
          signature. If you prefer delivery by TSC Extra with required
          signature, an additional cost will be applied, so please contact us
          before choosing this method. Whichever shipment choice you make, we
          will provide you with a link to track your package online. Shipping
          fees include handling and packing fees as well as postage costs.
          Handling fees are fixed, whereas transport fees vary according to
          total weight of the shipment. We advise you to group your items in one
          order. We cannot group two distinct orders placed separately, and
          shipping fees will apply to each of them. Your package will be
          dispatched at your own risk, but special care is taken to protect
          fragile objects. Boxes are amply sized and your items are
          well-protected.
          <br /> Delivery Options:
          <ul className="m-3">
            <li>
              Standard Delivery: Reliable and cost-effective service for all
              orders.
            </li>
            <li>Expedited Delivery: Fast delivery for urgent orders.</li>
          </ul>
          Delivery Timeframes:
          <ul className="m-3">
            <li>Standard Delivery : 3–5 business days</li>
            <li>Expedited Delivery : 1–2 business days</li>
          </ul>
        </p>
        <h3>FAQs: </h3>
        <Accordion className="m-4" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              What should I do if my order is delayed?
            </Accordion.Header>
            <Accordion.Body>
              Contact our support team with your order details, and we'll
              investigate immediately.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              Can I change my delivery address after placing an order?
            </Accordion.Header>
            <Accordion.Body>
              Address changes can be requested within 12 hours of placing the
              order by contacting our support team.
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
export default Delivery;
