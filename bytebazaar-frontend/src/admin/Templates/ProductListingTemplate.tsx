import { useContext } from "react";
import { Col, Row, Stack, Button } from "react-bootstrap";
import ProductInterface from "../../interfaces/ProductInterface";
import { ConfigContext } from "../../reducers/GlobalConfig";
import "./productlisitingtemplate.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  product: ProductInterface;
  key: string;
}
function ProductListingTemplate({ product }: Props) {
  const config = useContext(ConfigContext);
  const navigate = useNavigate();
  const deleteProduct = () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    axios
      .delete(config.server.uri + "delete-product/?id=" + product._id)
      .then((response) => {
        window.location.reload();
        // console.log(response);
      })
      .catch((error) => {
        // console.log(error);
      });
  };
  return (
    <Row className="mt-3 product">
      <Col xs={1}>
        <img
          src={
            product.featureImage || config.server.uri + "placholder_image.svg"
          }
          alt=""
          className="product-thumbnail"
        />
      </Col>
      <Col xs={4}>
        <Stack>
          <small className="product-id text-muted">
            <em>ID: {product._id}</em>
          </small>
          <h5 className="product-title text-lg-left">{product.name}</h5>
          <small className="product-slug text-muted">
            <em>slug: {product.slug}</em>
          </small>
        </Stack>
      </Col>
      <Col xs={2}>
        <p className="product-stock">
          {product.stock
            ? product.stock.valueOf() > 0
              ? `In Stock (${product.stock.valueOf()})`
              : "Out of Stock"
            : "---"}
        </p>
      </Col>
      <Col xs={2}>
        <span
          className={`mx-2 product-price ${
            product.salePrice ? "text-decoration-line-through text-danger" : ""
          }`}
        >
          {config.app.currency_symbol + product.price?.toString()}
        </span>
        {product.salePrice ? (
          <span
            className={`product-saleprice text-decoration-underline text-success`}
          >
            {config.app.currency_symbol + product.salePrice.toString()}
          </span>
        ) : (
          <></>
        )}
      </Col>
      <Col>
        <Stack
          direction="horizontal"
          className=" gap-2 w-100 d-flex justify-content-between px-4"
        >
          <Button
            variant="c-btn"
            className="my-3 px-3 c-btn "
            id="prodoct-edit"
            onClick={() => navigate(`/dashboard/product/${product._id}`)}
          >
            Edit
          </Button>
          <Button
            variant="c-btn"
            type="submit"
            className=" px-3 c-btn"
            onClick={() => deleteProduct()}
          >
            Delete
          </Button>
        </Stack>
      </Col>
    </Row>
  );
}

export default ProductListingTemplate;
