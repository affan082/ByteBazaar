import { Container, Row, Col, Accordion } from "react-bootstrap";
import "./faqs.scss";
function Faqs() {
  return (
    <>
      <Container className="mt-5">
        <h2 className="text-center mb-4 ">
          Frequently Asked <span className="text-warning">Question </span>
        </h2>

        <h6 className="text-center mb-5">Customer Service Management</h6>
        <Row>
          <Col md={6}>
            <Accordion>
              <Accordion.Item eventKey="0" className="custom-accordion">
                <Accordion.Header>
                  What is the multi-vendor services?
                </Accordion.Header>
                <Accordion.Body>
                  Multi-vendor services refer to a platform where multiple
                  vendors can sell their products or services. It allows
                  customers to browse and purchase from various vendors in one
                  place.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion>
              <Accordion.Item eventKey="1" className="custom-accordion">
                <Accordion.Header>
                  How to buy many products at a time?
                </Accordion.Header>
                <Accordion.Body>
                  To buy multiple products at a time, add desired items to your
                  cart and proceed to checkout. Review your cart for accuracy
                  before making the payment.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion>
              <Accordion.Item eventKey="2" className="custom-accordion">
                <Accordion.Header>Refund policy for customer.</Accordion.Header>
                <Accordion.Body>
                  Our refund policy ensures that customers can request a refund
                  within 30 days of purchase, provided the product meets the
                  refund criteria. Please review the policy details on our
                  website for more information.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion>
              <Accordion.Item eventKey="3" className="custom-accordion">
                <Accordion.Header>
                  Exchange policy for customer.
                </Accordion.Header>
                <Accordion.Body>
                  Customers can request an exchange within 15 days of purchase.
                  The product must be unused, undamaged, and in its original
                  packaging. Additional terms may apply.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>

          <Col md={6}>
            <Accordion>
              <Accordion.Item eventKey="4" className="custom-accordion">
                <Accordion.Header>
                  Giveaway products available.
                </Accordion.Header>
                <Accordion.Body>
                  We occasionally run promotional giveaways. Keep an eye on our
                  website and social media channels for announcements about
                  available giveaway products.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion>
              <Accordion.Item eventKey="5" className="custom-accordion">
                <Accordion.Header>
                  How to buy many products at a time?
                </Accordion.Header>
                <Accordion.Body>
                  To buy multiple products at a time, add desired items to your
                  cart and proceed to checkout. Review your cart for accuracy
                  before making the payment.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion>
              <Accordion.Item eventKey="6" className="custom-accordion">
                <Accordion.Header>Refund policy for customer.</Accordion.Header>
                <Accordion.Body>
                  Our refund policy ensures that customers can request a refund
                  within 30 days of purchase, provided the product meets the
                  refund criteria. Please review the policy details on our
                  website for more information.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Accordion>
              <Accordion.Item eventKey="7" className="custom-accordion">
                <Accordion.Header>
                  What is the multi-vendor services?
                </Accordion.Header>
                <Accordion.Body>
                  Multi-vendor services refer to a platform where multiple
                  vendors can sell their products or services. It allows
                  customers to browse and purchase from various vendors in one
                  place.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Faqs;
