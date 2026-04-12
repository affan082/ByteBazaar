import ProductInterface from "../interfaces/ProductInterface";
import "./product-carousel-template-1.scss";
import { Stack } from "react-bootstrap";
import Rating from "../components/Rating/Rating.tsx";
import Price from "../components/Price/Price.tsx";
import AddToCart from "../components/add-to-cart/AddToCart.tsx";
import { Link } from "react-router-dom";
import WishlistButton from "../components/WishlistButton/WishlistButton.tsx";
import { useContext } from "react";
import { UserContext } from "../reducers/UserContext.tsx";

function ProductCarouselTemplate_1(product: ProductInterface) {
  let { salePrice, price, url, rating, categories, featureImage, _id, name } =
    product;
  const primaryCategory = categories?.find((c: any) => c.name);
  const { user, setUser } = useContext(UserContext);
  const isInWishlist = user?.wishlist?.some((item) => {
    const itemProductId =
      typeof item.product === "string" ? item.product : item.product?._id;
    return itemProductId === product._id;
  });

  return (
    <Stack className="product-carousel-template-1">
      <span className="tag new-tag">NEW</span>
      {salePrice && price ? (
        <span className="tag discount-tag">{`${Math.ceil(
          ((salePrice.valueOf() - price?.valueOf()) * 100) / price.valueOf(),
        )}%`}</span>
      ) : (
        ""
      )}
      <a href={url || "#"}>
        <img
          src={featureImage?.toString()}
          alt=""
          className="product-feature-image"
        />
      </a>
      <Link
        to={`/shop/${primaryCategory?.slug}`}
        className="product-category"
        onClick={() => window.scrollTo(0, 0)}
      >
        <small>{primaryCategory?.name || "TEST"}</small>
      </Link>
      <Link
        to={url || "#"}
        className="product-name"
        onClick={() => window.scrollTo(0, 0)}
      >
        {name}
      </Link>
      <Rating rating={rating?.valueOf() || 0} key={_id.toString()} />
      <Price price={price} salePrice={salePrice} />

      <div className="product-actions-container mt-4 ">
        <AddToCart product={product} className="product-add-to-cart-submit" />
        <WishlistButton
          product={product}
          size="sm"
          variant="outline"
          showLabel={false}
          className="product-add-to-wishlist-submit"
          isInWishlist={isInWishlist}
        />
      </div>
    </Stack>
  );
}

export default ProductCarouselTemplate_1;
