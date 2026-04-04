// // import { useContext } from "react";
// import ProductInterface from "../interfaces/ProductInterface";
// // import { ConfigContext } from "../reducers/GlobalConfig";
// import "./product-carousel-template-1.scss";
// import { Stack } from "react-bootstrap";
// import Rating from "../components/Rating/Rating.tsx";
// import Price from "../components/Price/Price.tsx";
// import AddToCart from "../components/add-to-cart/AddToCart.tsx";

// function ProductCarouselTemplate_1(product: ProductInterface) {
//   // const config = useContext(ConfigContext);
//   let { salePrice, price, url, rating, categories, featureImage, _id, name } =
//     product;
//   return (
//     <Stack className="product-carousel-template-1">
//       <span className={"tag new-tag"}>NEW</span>
//       {salePrice && price ? (
//         <span className={"tag discount-tag"}>{`${Math.ceil(
//           ((salePrice.valueOf() - price?.valueOf()) * 100) / price.valueOf()
//         )}%`}</span>
//       ) : (
//         ""
//       )}
//       <a href={url || "#"}>
//         <img
//           src={featureImage?.toString()}
//           alt=""
//           className="product-feature-image"
//         />
//       </a>
//       <a href={"#"} className="product-category">
//         <small>
//           {categories?.map((c, i) => {
//             return c.name + (i !== categories?.length - 1 ? "," : "");
//           }) || "TEST"}
//         </small>
//       </a>
//       <a href={url || "#"} className="product-name">
//         {name}
//       </a>
//       <Rating rating={rating?.valueOf() || 0} key={_id.toString()} />
//       <Price price={price} salePrice={salePrice} />
//       {/*<div className={"product-add-to-cart"}>*/}
//       {/*    <Form action={config.app["add-to-cart"]} method="POST">*/}
//       {/*        <input type="hidden" name="product_id" value={_id} readOnly />*/}
//       {/*        <input type="hidden" name="product_quantity" value={1} readOnly />*/}
//       {/*        <Button type="submit" variant="secondary" size="sm" className="product-add-to-cart-submit">*/}
//       {/*            Add to Cart*/}
//       {/*        </Button>*/}
//       {/*    </Form>*/}
//       {/*</div>*/}
//       <AddToCart product={product} className={"product-add-to-cart-submit"} />
//     </Stack>
//   );
// }

// export default ProductCarouselTemplate_1;
// ProductCarouselTemplate_1.tsx

import ProductInterface from "../interfaces/ProductInterface";
import "./product-carousel-template-1.scss";
import { Stack } from "react-bootstrap";
// import Rating from "../components/Rating/Rating.tsx";
import Price from "../components/Price/Price.tsx";
import AddToCart from "../components/add-to-cart/AddToCart.tsx";
import WishlistButton from "../components/WishlistButton/WishlistButton.tsx";
import { useContext } from "react";
import { UserContext } from "../reducers/UserContext.tsx";

function ProductCarouselTemplate_1(product: ProductInterface) {
  let { salePrice, price, url, rating, categories, featureImage, _id, name } =
    product;
  const { user, setUser } = useContext(UserContext);
  const isInWishlist = user?.wishlist?.some((item) => {
    const itemProductId =
      typeof item.product === "string"
        ? item.product
        : item.product?._id;
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
      <a href="#" className="product-category">
        <small>
          {categories?.map((c: any, i) => {
            return c.name + (i !== categories?.length - 1 ? "," : "");
          }) || "TEST"}
        </small>
      </a>
      <a href={url || "#"} className="product-name">
        {name}
      </a>
      {/* <Rating rating={rating?.valueOf() || 0} key={_id.toString()} /> */}
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
