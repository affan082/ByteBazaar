// import React from "react";
import { Button, Stack } from "react-bootstrap";
// import { ProductProps } from "../interfaces/PropInterfaces";
import ProductInterface from "../interfaces/ProductInterface";
import "./home-slide-template.css";

function HomeSilderTemplate({
  name,
  price,
  productId,
  featureImage = "",
}: ProductInterface) {
  return (
    <Stack
      style={{ backgroundImage: `url(/assets/home-slider-img-1.jpg)` }}
      className="hero-slide justify-content-center m-0 p-5"
      gap={4}
    >
      <h3 className="title">
        HP-930 Bluetooth
        <br />
        Stereo Headphone
      </h3>
      <h5 className="price">Sale for 4 days only.</h5>
      <Button variant="secondary" className="shop-now" href={`/shop`}>
        Shop Now
      </Button>
    </Stack>
  );
}

export default HomeSilderTemplate;
