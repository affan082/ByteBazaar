import { useContext, useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import ProductInterface from "../../interfaces/ProductInterface.tsx";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import ProductPreviewModal from "./ProductPreview.tsx";
import "./adminProductListing.scss";

function AdminProductListing() {
  const config = useContext(ConfigContext);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductInterface | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.post(config.server.uri + "products/", {
          withCredentials: true,
        });
        setProducts(res.data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = (p: ProductInterface) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    axios.delete(config.server.uri + "delete-product/?id=" + p._id).then(() => {
      window.location.reload();
      // console.log(response);
    });
  };

  const handleViewProduct = (p: ProductInterface) => {
    setSelectedProduct(p);
    setShowPreview(true);
  };

  return (
    <Container fluid className=" admin-product-listing">
      <Row className="mb-3">
        <Col>
          <h1 className="text-center text-warning">Products List</h1>
        </Col>
      </Row>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <div className="product-list-wrapper">
          <div className="product-list-header">
            <span className="col ">SKU</span>
            <span className="col ">Name</span>
            <span className="col ">Price</span>
            <span className="col salePrice">Sale Price</span>
            <span className="col stock">Stock</span>
            <span className="col categories">Categories</span>
            <span className="col actions">Actions</span>
          </div>
          <div className="product-list-body">
            {products.length > 0 ? (
              products.map((p) => (
                <div className="product-row" key={p._id}>
                  <span className="col sku ">{p.sku}</span>
                  <span className="col name t-length">{p.name}</span>
                  <span className="col price">{String(p.price)}</span>
                  <span className="col salePrice">
                    {p.salePrice ? String(p.salePrice) : "-"}
                  </span>
                  <span className="col stock">{String(p.stock) ?? "N/A"}</span>
                  <span className="col categories t-length">
                    {p.categories?.map((c) => c.name).join(", ") ?? "-"}
                  </span>
                  <span className="col actions">
                    <Button
                      variant="c-btn"
                      className="c-btn me-2"
                      onClick={() => deleteProduct(p)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="c-btn"
                      className=" px-3 c-btn"
                      onClick={() => handleViewProduct(p)}
                    >
                      View
                    </Button>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center no-products">No products found</p>
            )}
          </div>
        </div>
      )}
      {selectedProduct && (
        <ProductPreviewModal
          show={showPreview}
          onHide={() => setShowPreview(false)}
          product={selectedProduct}
        />
      )}
    </Container>
  );
}
export default AdminProductListing;
