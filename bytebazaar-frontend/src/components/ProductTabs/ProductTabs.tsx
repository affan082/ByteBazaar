import { Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import ProductInterface from "../../interfaces/ProductInterface";
import ReviewInterface from "../../interfaces/ReviewInterface";
import axios from "axios";
import { ConfigContext } from "../../reducers/GlobalConfig";
import Rating from "../Rating/Rating";
import "./productTabs.scss";
import ReviewModal from "../ReviewModal/ReviewModal";
import { UserContext } from "../../reducers/UserContext";

const ProductTabs = ({
  productData,
  activeTab,
  setActiveTab,
}: {
  productData: ProductInterface;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const config = useContext(ConfigContext);
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { user } = useContext(UserContext);
  const currentUserId = user?._id;

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await axios.get(
        config.server.uri + `reviews?productId=${productData._id}`,
      );
      setReviews(res.data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(config.server.uri + `review/${reviewId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(reviews.filter((r) => r._id !== reviewId));
      alert("Review deleted successfully");
      // fetchReviews();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete review");
    }
  };

  return (
    <>
      <Row>
        <Col sm={12} className="product-tabs mt-5">
          <Tabs
            activeKey={activeTab}
            className="tab-container nav-tabs justify-content-center"
            onSelect={(key) => setActiveTab(key || "description")}
          >
            <Tab eventKey="description" title="Description" />
            <Tab eventKey="productdetails" title="Product Details" />
            <Tab
              eventKey="reviews"
              title={<span id="tab-reviews">Reviews ({reviews.length})</span>}
            />
          </Tabs>
        </Col>

        <div className="tab-action">
          {activeTab === "description" ? (
            <p>{productData.description || "No Description Available"}</p>
          ) : activeTab === "productdetails" ? (
            <p>
              <span className="product-brand">Brand:</span>{" "}
              {productData.manufacturer || "No Product Details Available"}
            </p>
          ) : loadingReviews ? (
            <p>Loading reviews...</p>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Customer Reviews</h5>
                <Button
                  variant="c-btn"
                  className="c-btn"
                  onClick={() => setShowReviewModal(true)}
                >
                  Write a Review
                </Button>
              </div>
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review) => {
                    const isOwner = review.user._id === currentUserId;

                    return (
                      <div
                        key={review._id}
                        className="review-item p-3 mb-3 border rounded"
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex gap-3">
                            <img
                              src={
                                review.user.profileImageUrl
                                  ? config.server.uri +
                                    review.user.profileImageUrl
                                  : "/default-avatar.png"
                              }
                              alt={review.user.fullname}
                              style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <h6 className="mb-1">{review.user.fullname}</h6>
                              <Rating rating={review.rating} key={review._id} />
                              <p className="text-muted small mb-1">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {isOwner && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteReview(review._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>

                        <p className="mb-0">{review.comment}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </Row>
      <ReviewModal
        show={showReviewModal}
        handleClose={() => setShowReviewModal(false)}
        product={productData}
        onReviewSubmitted={fetchReviews}
      />
    </>
  );
};

export default ProductTabs;
