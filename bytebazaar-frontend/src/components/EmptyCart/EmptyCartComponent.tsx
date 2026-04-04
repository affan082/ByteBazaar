import { useContext, useEffect } from "react";
import { Container, Card, Button, Row } from "react-bootstrap";
import "./empty-cart.scss";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";

const EmptyCartComponent = () => {
  // Dynamically adds the Bootstrap CSS to the head to ensure it's available.
  const config = useContext(ConfigContext);

  return (
    <>
      <div className="empty-cart-container">
        <Container fluid className="p-5">
          <Row className="justify-content-center">
            <Card className="empty-cart-card border-0">
              <Card.Body>
                {/* SVG icon for an empty shopping cart */}
                <svg
                  className="cart-icon mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                <Card.Title as="h2" className="text-3xl font-weight-bold mb-2">
                  Your Cart is Empty
                </Card.Title>
                <Card.Text className="text-muted mb-4">
                  Looks like you haven't added anything to your cart yet.
                </Card.Text>
                <Button
                  variant="primary"
                  href={config.app.urls.root}
                  className="w-100 rounded-pill py-2"
                >
                  Start Shopping
                </Button>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default EmptyCartComponent;
