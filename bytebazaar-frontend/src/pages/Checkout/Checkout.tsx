import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./Checkout.scss";
import CartSummary from "../../components/CartSummary/CartSummary.tsx";
// import {ConfigContext} from "../../reducers/GlobalConfig.tsx";
import QueryableCustomCarousel from "../../components/carousel/QueryableCustomCarousel.tsx";
import ProductCarouselTemplate_1 from "../../templates/ProductCarouselTemplate1.tsx";
import { carouselResponsiveTemplate } from "../../utils/carouselslideconfig.tsx";
import { HandlePayment } from "../../reducers/PaymentUtils.tsx";
import { CartInterface } from "../../interfaces/CartInterface.ts";
import { GetCurrentCart } from "../../reducers/CartUtils.ts";
import EmptyCartComponent from "../../components/EmptyCart/EmptyCartComponent.tsx";
import cartService from "../../services/cartService.ts";

//TODO: Remove Extra things from this Page. Or remove this page all along.
const Checkout = () => {
  // const config = useContext(ConfigContext);
  // const [coupon, setCoupon] = useState("");
  // const [subtotal] = useState(162.0);
  // const [delivery] = useState(32.4);
  // const [discount, setDiscount] = useState(0);
  const [selectedOption, setSelectedOption] = useState("guest");
  const [shippingMethod, setShippingMethod] = useState("free");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [comments, setComments] = useState({ shipping: "", payment: "" });
  // const currency = config.app.currency_symbol;
  const [cart, setCart] = useState<CartInterface[]>();

  useEffect(() => {
    cartService.getCart().then(setCart);
  }, []);

  if (!cart?.length) {
    return <EmptyCartComponent />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // if (!selectedOption) {
    //   alert("Please select an option before continuing!");
    //   return;
    // }
    // alert(`You selected: ${selectedOption}`);

    GetCurrentCart().then((res) => {
      HandlePayment(res);
    });
  };

  return (
    <Container className="checkout-container">
      <Row>
        <Col md={4} className="my-3">
          <CartSummary />
        </Col>
        <Col md={8} className="my-3">
          <Card className="custom-card">
            <Card.Body>
              <Card.Title>New Customer</Card.Title>
              <h6 className="mt-4">Checkout Options</h6>
              <Form onSubmit={handleSubmit}>
                <Form.Check
                  inline
                  type="radio"
                  label="Guest Account"
                  name="checkout"
                  checked={selectedOption === "guest"}
                  onChange={() => setSelectedOption("guest")}
                  className="mx-4"
                />

                <Form.Check
                  inline
                  type="radio"
                  label="Register Account"
                  name="checkout"
                  checked={selectedOption === "register"}
                  onChange={() => setSelectedOption("register")}
                  className="mx-4"
                />

                <Form.Check
                  inline
                  type="radio"
                  label="Login Account"
                  name="checkout"
                  checked={selectedOption === "login"}
                  onChange={() => setSelectedOption("login")}
                  className="mx-4"
                />
                <p className="text">
                  By creating an account you will be able to shop faster, be up
                  <br />
                  to date on an order's status, and keep track of the orders you
                  <br />
                  have previously made.
                </p>
                <Button
                  variant="c-btn"
                  type="submit"
                  className="my-3 px-3 c-btn"
                >
                  Continue
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="my-3">
          <Card className="custom-card">
            <Card.Body>
              <Card.Title>Delivery Method</Card.Title>
              <p className="text">
                Please select the preferred shipping method to use on this order
              </p>
              <Form>
                <Form.Check
                  type="radio"
                  label="Free Shipping (Rate - $0.00)"
                  name="shippingMethod"
                  value="free"
                  checked={shippingMethod === "free"}
                  onChange={() => setShippingMethod("free")}
                />
                <Form.Check
                  type="radio"
                  label="Flat Rate (Rate - $5.00)"
                  name="shippingMethod"
                  value="flat"
                  checked={shippingMethod === "flat"}
                  onChange={() => setShippingMethod("flat")}
                />
                <Form.Group className="mt-3">
                  <Form.Label>Add Comments About Your Order</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Comments"
                    rows={2}
                    value={comments.shipping}
                    onChange={(e) =>
                      setComments({ ...comments, shipping: e.target.value })
                    }
                  />
                </Form.Group>
                <Button
                  variant="warning"
                  className="apply-btn"
                  // onClick={}
                >
                  Send
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="my-3">
          <Card className="custom-card">
            <Card.Body>
              <Card.Title>Payment Method</Card.Title>
              <p className="text">
                Please select the preferred payment method to use on this order
              </p>
              <Form>
                <Form.Check
                  type="radio"
                  label="Cash On Delivery"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />

                <Form.Group className="mt-3">
                  <Form.Label>Add Comments About Your Order</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Comments"
                    rows={2}
                    value={comments.payment}
                    onChange={(e) =>
                      setComments({ ...comments, payment: e.target.value })
                    }
                  />
                </Form.Group>
                <Button
                  variant="warning"
                  className="apply-btn"
                  // onClick={}
                >
                  Send
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Container>
        <h3 className="text-warning justify-content-center d-flex m-4">
          New Arrival
        </h3>
        <p className="my-4 text justify-content-center d-flex">
          Browse the collection of top products
        </p>
        <Row className="justify-content-center d-flex">
          <Col>
            <QueryableCustomCarousel
              query={{ limit: 12, skip: 5 }}
              TemplateComponent={ProductCarouselTemplate_1}
              className={"styled-carousel p-0"}
              itemsClassName={"px-1"}
              infinite={true}
              title={"Category-1"}
              responsive={carouselResponsiveTemplate}
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Checkout;
