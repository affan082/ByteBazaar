// import { useContext } from "react";
import ProductInterface from "../interfaces/ProductInterface";
// import { ConfigContext } from "../reducers/GlobalConfig";
import "./product-carousel-template-2.scss";
import { Stack } from "react-bootstrap";
import Rating from "../components/Rating/Rating.tsx";

function ProductCarouselTemplate_2(product: ProductInterface) {
  // const config = useContext(ConfigContext);
  let { salePrice, price, url, rating, categoryId, featureImage, name } =
    product;
  return (
    <Stack
      direction={"horizontal"}
      className="product-carousel-template-2 p-3 align-items-start"
    >
      <Stack className={"product-detail gap-1"}>
        <a href={url || "#"} className="product-name">
          {name}
        </a>
        <Rating
          rating={rating?.valueOf() || 0}
          key={"product-carousel-template-2-rating"}
        />
        <Stack className={"gap-1"}>
          {/* <h5>
            {salePrice ? (
              <span className="product-saleprice">
                {config.app.currency_symbol + salePrice.toString()}
              </span>
            ) : (
              <></>
            )}
            <span
              className={
                "product-price" +
                (salePrice
                  ? " text-decoration-line-through text-danger mx-2"
                  : "")
              }
            >
              {config.app.currency_symbol + price?.toString()}
            </span>
          </h5> */}
        </Stack>
      </Stack>
      <a href={url} className="product-feature-image-wrapper">
        <img
          src={featureImage?.toString()}
          alt=""
          className="product-feature-image"
        />
      </a>
    </Stack>
  );
}

export default ProductCarouselTemplate_2;
