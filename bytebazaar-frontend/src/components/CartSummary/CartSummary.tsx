import { Button, Card, Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import "./cart-summary.scss";
import { CartInterface } from "../../interfaces/CartInterface.ts";
import { GetCurrentCart } from "../../reducers/CartUtils.ts";

function CartSummary() {
  const config = useContext(ConfigContext);
  const [cartItems, setCartItems] = useState<CartInterface[]>();
  const [subtotal, setSubtotal] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    GetCurrentCart().then(setCartItems);
  }, []);

  useEffect(() => {
    let sum = 0;
    if (cartItems?.length) {
      cartItems?.forEach((i) => {
        sum += i.quantity * i.product.price.valueOf();
      });
    }
    // setDelivery(getDeliveryCharges);
    setSubtotal(sum);
  });

  function applyDiscount() {}

  return (
    <Card className="custom-card">
      <Card.Body className="justify-content-between">
        <Card.Title>Summary</Card.Title>
        <p className={"subtotal-price"}>
          Subtotal <span className="float-end">${subtotal.toFixed(2)}</span>
        </p>
        <p className={"delivery-charges"}>
          Delivery-Charges{" "}
          <span className="float-end">${delivery.toFixed(2)}</span>
        </p>

        <p>Coupon Discount :</p>
        <Form.Control
          type="text"
          placeholder="Enter Coupon Code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="coupon-input"
        ></Form.Control>
        <Button variant="warning" className="apply-btn" onClick={applyDiscount}>
          Apply
        </Button>
        <hr />
        <p>
          <strong>
            Total Amount{" "}
            <span className="float-end">
              ${(subtotal + delivery - discount).toFixed(2)}
            </span>
          </strong>
        </p>
        <hr />
      </Card.Body>
    </Card>
  );
}

export default CartSummary;
