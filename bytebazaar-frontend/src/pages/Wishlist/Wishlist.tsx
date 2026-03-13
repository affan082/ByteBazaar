import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ConfigContext } from "../../reducers/GlobalConfig";
import "./wishlist.scss";
import { WishlistInterface } from "../../interfaces/WishlistInterface";
import wishlistService from "../../services/wishlistService";
// import WishlistButton from "../../components/WishlistButton/WishlistButton";
import ProductInterface from "../../interfaces/ProductInterface";
import AddToCart from "../../components/add-to-cart/AddToCart";
import { WishlistItem } from "../../interfaces/WishlistInterface";
import { useState, useContext, useEffect } from "react";
// import { GetCurrentWishlist } from "../../reducers/WishlistUtils";
// import { UserContext } from "../../reducers/UserContext";
// import { UserInterface } from "../../reducers/AuthProvider";

function Wishlist() {
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistInterface[]>([]);
  // const [user, setUser] = useState<Partial<UserInterface>>({});
  const config = useContext(ConfigContext);
  const navigate = useNavigate();

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const wishlist = await wishlistService.getWishlist();
      setWishlistItems(wishlist);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadWishlist();
  }, []);

  const handleViewProduct = (product: ProductInterface) => {
    navigate(`/product/${product.slug}`, {
      state: {
        productData: product,
      },
    });
  };
  const handleRemove = async (item: WishlistInterface) => {
    try {
      await wishlistService.removeFromWishlist(item.product._id);
      await loadWishlist();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return wishlistItems.length ? (
    <>
      <Container className="page wishlist-page " fluid>
        <Row className="my-4">
          <div className="d-flex justify-content-center align-items-end">
            <h2 className="heading-title">
              My <span>Wishlist</span>
            </h2>
          </div>
        </Row>
        {wishlistItems.length > 0 ? (
          <>
            <Row>
              {wishlistItems.map((item: WishlistItem) => (
                <Col lg={3} md={4} sm={6} xs={12} className="my-3">
                  <Card className="product-card">
                    <div className="image-wrapper">
                      <Card.Img
                        src={
                          `${config.server.uri}${item.product?.featureImage}` ||
                          config.app.placeholder_image_url
                        }
                        onClick={() => handleViewProduct(item.product)}
                        className="product-image "
                        alt="product"
                      />
                    </div>
                    <Card.Body>
                      <Card.Title
                        onClick={() => handleViewProduct(item.product)}
                      >
                        {item.product.name}
                      </Card.Title>
                      <Card.Text>Rs.{item.product.salePrice}</Card.Text>
                      <div className="card-buttons">
                        <AddToCart
                          product={item.product}
                          className="cart-btn"
                        />
                        <Button
                          variant="outline-danger"
                          onClick={() => handleRemove(item)}
                          className="wishlist-btn"
                        >
                          Remove
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <></>
        )}
        <Row></Row>
      </Container>
    </>
  ) : (
    <div className="text-center py-5">
      <div className="empty-wishlist-icon mb-3" style={{ fontSize: "4rem" }}>
        🤍
      </div>
      <h5 className="mb-3">Your wishlist is empty</h5>
      <p className="text-muted mb-4">
        Browse our products and add items you love to your wishlist
      </p>
      <Button variant="primary" onClick={() => navigate("/")}>
        Browse Products
      </Button>
    </div>
  );
}

export default Wishlist;
