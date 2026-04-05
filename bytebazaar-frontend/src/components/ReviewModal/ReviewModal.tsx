import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useState, useContext } from "react";
import "./reviewModal.scss";
import Rating from "../Rating/Rating";
import axios from "axios";
import { ConfigContext } from "../../reducers/GlobalConfig";

const ReviewModal = ({
  show,
  handleClose,
  product,
  onReviewSubmitted,
}: any) => {
  const config = useContext(ConfigContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        config.server.uri + "review/add",
        {
          productId: product._id,
          rating,
          comment,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Review submitted successfully!");
      setComment("");
      setRating(0);
      handleClose();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="review-modal-wrapper"
      size="lg"
    >
      <Modal.Header className="review-modal-header" closeButton>
        <Modal.Title className="review-modal-title">
          WRITE YOUR REVIEW
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="align-items-start">
          <Col xs={12} md={4} className="review-modal-left">
            <p className="review-product-name">{product?.name}</p>
            <p>{product?.shortDescription}</p>
          </Col>

          <Col xs={12} md={8} className="review-modal-right">
            <div className="rating-wrapper">
              <span className="rating-label">Quality</span>
              <div style={{ display: "flex", gap: "5px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi bi-star-fill ${star <= rating ? "text-warning" : "text-muted"}`}
                    style={{ cursor: "pointer", fontSize: "20px" }}
                    onClick={() => setRating(star)}
                  ></i>
                ))}
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="reviewText" className="form-group">
                <Form.Label>Your review*</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Your review*"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </Form.Group>

              <p className="required-fields-note">* Required fields</p>
              <div className="button-group">
                <Button
                  variant="c-btn"
                  type="submit"
                  className="c-btn"
                  disabled={submitting}
                >
                  {submitting ? "SUBMITTING..." : "SEND"}
                </Button>
                <span>or</span>
                <Button
                  variant="c-btn"
                  onClick={handleClose}
                  className=" c-btn"
                  disabled={submitting}
                >
                  CANCEL
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewModal;
