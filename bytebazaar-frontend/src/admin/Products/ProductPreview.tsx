import { Modal, Button, Row, Col, Image } from "react-bootstrap";
import ProductInterface from "../../interfaces/ProductInterface";
import { useContext } from "react";
import { ConfigContext } from "../../reducers/GlobalConfig";

interface ProductPreviewModalProps {
  show: boolean;
  onHide: () => void;
  product: ProductInterface;
}

function ProductPreview({ show, onHide, product }: ProductPreviewModalProps) {
  const config = useContext(ConfigContext);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Product Preview</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <Image
              src={`${config.server.uri}${product.featureImage}`}
              alt="null"
              fluid
              rounded
              className="mb-3"
              style={{
                cursor: "pointer",
                maxHeight: "280px",
                objectFit: "cover",
              }}
            />
            {product.gallery && product.gallery.length > 0 && (
              <div className="d-flex gap-2 flex-wrap">
                {product.gallery.map((img: String, idx: number) => (
                  <Image
                    key={idx}
                    src={`${config.server.uri}${img}`}
                    width={80}
                    height={80}
                    thumbnail
                  />
                ))}
              </div>
            )}
          </Col>

          <Col md={6}>
            <h4>{product.name}</h4>
            <p className="text-muted">{product.shortDescription}</p>

            <h5 className="text-success mb-3">
              ${(product.salePrice || product.price)?.toString()}
              {product.salePrice && (
                <small className="text-decoration-line-through text-muted ms-2">
                  ${product.price?.toString()}
                </small>
              )}
            </h5>

            <div className="mb-2">
              <strong>SKU:</strong> {product.sku || "N/A"}
            </div>
            <div className="mb-2">
              <strong>Brand:</strong> {product.brand || "N/A"}
            </div>
            <div className="mb-2">
              <strong>Stock:</strong> {product.stock?.toString() || "N/A"}
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductPreview;
