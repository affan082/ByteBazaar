import React, { useContext, useEffect, useState } from "react";
import "./cart.scss";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import { CartInterface } from "../../interfaces/CartInterface.ts";
import EmptyCartComponent from "../../components/EmptyCart/EmptyCartComponent.tsx";
import { HandlePayment } from "../../reducers/PaymentUtils.tsx";
import cartService from "../../services/cartService.ts";
import { CartItem } from "../../interfaces/CartInterface.ts";
function Cart() {
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartInterface[]>([]);
  const config = useContext(ConfigContext);

  const loadCart = async () => {
    setLoading(true);
    try {
      const cart = await cartService.getCart();
      setCartItems(cart);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadCart();
  }, []);

  const increaseItemQuantity = async (productId: string) => {
    setUpdatingItem(productId);
    try {
      const item = cartItems.find((item) => item.product?._id === productId);
      if (item) {
        const newQuantity = item.quantity + 1;
        await cartService.updateCartItem(productId, newQuantity);
        await loadCart();
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const decreaseItemQuantity = async (productId: string) => {
    setUpdatingItem(productId);
    try {
      const item = cartItems.find((item) => item.product?._id === productId);
      if (item) {
        const newQuantity = item.quantity - 1;

        if (newQuantity < 1) {
          await cartService.updateCartItem(productId, newQuantity);
        } else {
          await cartService.updateCartItem(productId, newQuantity);
        }

        await loadCart();
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const deleteCartItem = async (item: CartInterface) => {
    if (!item.product?._id) return;

    try {
      await cartService.removeFromCart(item.product._id);
      await loadCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const subTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(
        String(item.product?.salePrice || item.product?.price),
      );
      const quantity = parseInt(String(item.quantity));

      if (!isNaN(price) && !isNaN(quantity)) {
        return sum + price * quantity;
      }

      return sum;
    }, 0);

    return total;
  };

  const calculateTotal = () => {
    const total = subTotal();
    return isNaN(total) ? "0.00" : total.toFixed(0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    cartService.getCart().then((res) => {
      HandlePayment(res);
    });
  };
  return cartItems.length ? (
    <>
      <Container className="page cart-page " fluid>
        <Row className="page-section">
          <Col xl={7} className="cart-list-col">
            <Container className="cart-listing-wrapper">
              <Row className="cart-listing-header">
                <Col xl={4}>
                  <h5>Product</h5>
                </Col>
                <Col xl={2}>
                  <h5>Price</h5>
                </Col>
                <Col xl={2}>
                  <h5>Quantity</h5>
                </Col>
                <Col xl={2}>
                  <h5>Total</h5>
                </Col>
                <Col xl={2}></Col>
              </Row>
              <Container className="cart-listing">
                {cartItems.map((item: CartItem) => {
                  const { product, quantity, total } = item;

                  let displayTotal =
                    Number(product?.salePrice || product?.price) * quantity;

                  if (!total || isNaN(parseFloat(total))) {
                    const price = parseFloat(
                      product?.salePrice || product?.price,
                    );
                    const validPrice = isNaN(price) ? 0 : price;
                    displayTotal = validPrice * quantity;
                  }

                  const unitPrice = product?.salePrice || product?.price;
                  const displayUnitPrice = isNaN(unitPrice) ? 0 : unitPrice;

                  return (
                    <Row
                      className="cart-list-item"
                      key={`cart-item-${product?._id}`}
                    >
                      <Col
                        xs={12}
                        xl={4}
                        className="cart-list-item-name p-0 d-flex flex-row align-items-center"
                      >
                        <img
                          src={
                            `${config.server.uri}${product?.featureImage}` ||
                            config.app.placeholder_image_url
                          }
                          className="product-image"
                          alt="product"
                        />
                        <h6 className="product-name">{product?.name}</h6>
                      </Col>
                      <Col xs={3} xl={2} className="cart-list-item-price">
                        {config.app.currency_symbol}{" "}
                        {displayUnitPrice.toFixed(0)}
                      </Col>
                      <Col xs={2} xl={2} className="cart-list-item-quantity">
                        <button
                          className="icon"
                          onClick={() => decreaseItemQuantity(product?._id)}
                        >
                          -
                        </button>
                        (x{quantity})
                        <button
                          className="icon"
                          onClick={() => increaseItemQuantity(product?._id)}
                        >
                          +
                        </button>
                      </Col>
                      <Col xs={4} xl={2} className="cart-list-item-total">
                        {config.app.currency_symbol} {displayTotal.toFixed(0)}
                      </Col>
                      <Col
                        xs={1}
                        xl={{ span: 1, offset: 1 }}
                        className="cart-list-item-deleted"
                      >
                        <i
                          className="bi bi-trash icon"
                          onClick={() => deleteCartItem(item)}
                        ></i>
                      </Col>
                    </Row>
                  );
                })}
              </Container>
            </Container>
          </Col>
          <Col xl={{ span: 4, offset: 1 }} className="cart-summary-col">
            <Container className="cart-estimate-form-wrapper">
              <Row>
                <h4 className="cart-form-header">Summary</h4>
              </Row>
              <hr />
              <Row>
                <Col className="px-3" xs={6} lg={6} xl={6}>
                  Sub-Total
                </Col>
                <Col
                  className="px-3 ms-n3"
                  xs={{ span: 4, offset: 2 }}
                  lg={{ span: 4, offset: 2 }}
                  xl={{ span: 4, offset: 2 }}
                >
                  {config.app.currency_symbol}
                  {isNaN(subTotal()) ? "0.00" : subTotal().toFixed(0)}
                </Col>
              </Row>
              <hr />
              <Row>
                <div className="text-center mt-3 py-3">
                  <h5>
                    Total Amount: {config.app.currency_symbol}
                    {calculateTotal()}
                  </h5>
                </div>
              </Row>
              <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <a href="/checkout">
                    <Button
                      variant="c-btn"
                      type="submit"
                      className="my-3 px-3 c-btn"
                    >
                      Proceed to Checkout
                    </Button>
                  </a>
                </div>
              </Form>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  ) : (
    <EmptyCartComponent />
  );
}
export default Cart;
