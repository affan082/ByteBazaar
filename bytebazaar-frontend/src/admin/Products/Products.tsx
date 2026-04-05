import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GetProducts } from "../../queries/GetProducts";
import ProductListingTemplate from "../Templates/ProductListingTemplate.tsx";
import { UserContext } from "../../reducers/UserContext.tsx";

function Products() {
  const [productList, setProductList] = useState<React.ReactNode[]>([]);
  const [productListLimit, setProductListLimit] = useState(10);
  const { user } = useContext(UserContext);

  useEffect(() => {
    GetProducts({ limit: productListLimit, seller: user?._id || "" }).then(
      (data: any) => {
        const newList = data.map((product: any) => {
          return <ProductListingTemplate key={product._id} product={product} />;
        });
        setProductList(newList);
      },
    );
  }, [productListLimit]);

  return (
    <Container className="page">
      <Row className="mb-3">
        <Col>
          <h1 className="page-title text-center text-warning">All Products</h1>
        </Col>
      </Row>
      <Row className="product-list">
        <Container>{productList}</Container>
      </Row>
    </Container>
  );
}

export default Products;
