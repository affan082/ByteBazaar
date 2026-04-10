import { useContext, useState, useEffect } from "react";
import { Stack, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { GetProducts } from "../../queries/GetProducts.tsx";
import { ConfigContext } from "../../reducers/GlobalConfig";
import { UserContext } from "../../reducers/UserContext";
import ProductInterface from "../../interfaces/ProductInterface";
// import ReviewModal from "../ReviewModal/ReviewModal.tsx";
import Spinner from "../spinner/Spinner.tsx";
import NotFound from "../../pages/NotFound/NotFound.tsx";
// import axios from "axios";
import "./productdetails.scss";
import AddToCart from "../add-to-cart/AddToCart.tsx";
import WishlistButton from "../WishlistButton/WishlistButton.tsx";

interface ProductDetailsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const ProductDetails = ({ setActiveTab }: ProductDetailsProps) => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const config = useContext(ConfigContext);
  const [productData, setProductData] = useState<ProductInterface>();
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(UserContext);
  const isInWishlist = user?.wishlist?.some(
    (item: any) =>
      item.product === productData?._id ||
      item.product._id === productData?._id,
  );

  useEffect(() => {
    GetProducts({ slug: slug })
      .then((data) => {
        if (data.length > 0) {
          setProductData(data[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <Spinner />;
  } else if (!productData) return <NotFound />;

  return (
    <>
      <Col sm={12} md={6}>
        <Stack className="product-details mt-4 gap-3">
          <h1 className="product-title">{productData?.name}</h1>
          <Stack direction="horizontal" className="product-price-info gap-2">
            <h5 className="product-original-price">
              {config.app.currency_symbol}
              {productData.salePrice?.toFixed(2)}
            </h5>
            <span className="product-discounted-price text-decoration-line-through text-danger">
              {config.app.currency_symbol}
              {productData.price?.toFixed(2)}
            </span>
            {productData.salePrice && (
              <span className="product-discount">SAVE </span>
            )}
          </Stack>
          <Stack direction="horizontal" className="product-size">
            <Stack direction="vertical" className="size-label-container">
              <p className="product-short-description">
                {productData?.shortDescription}
              </p>
            </Stack>
          </Stack>

          <Stack
            direction="horizontal"
            className="product-actions align-items-end gap-2"
          >
            <Stack direction="vertical" className="quantity-label-container">
              <label className="quantity-label">Quantity</label>
              <input
                type="number"
                id="quantity"
                className="quantity-input p-2"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                max={productData.stock as number}
                disabled={!productData.stock}
              />
            </Stack>
            <AddToCart
              product={productData}
              quantity={quantity}
              className="add-to-cart-button"
              disabled={!productData.stock}
            ></AddToCart>
            <WishlistButton
              product={productData}
              size="sm"
              variant="outline"
              showLabel={false}
              isInWishlist={isInWishlist}
              className="product-add-to-wishlist-submit"
            />
          </Stack>

          <div className="product-additional-info">
            <p>
              Availability:{" "}
              {productData.stock ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </p>
          </div>
          <div className="social-share-icons-container">
            <p className="share-label">Share</p>
            <a href="#">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#">
              <i className="bi bi-pinterest"></i>
            </a>
          </div>
        </Stack>
      </Col>
    </>
  );
};
export default ProductDetails;
