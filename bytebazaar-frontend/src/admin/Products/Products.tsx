import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  FormControl,
  FormLabel,
  InputGroup,
  Row,
} from "react-bootstrap";
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

  // console.log(productList);
  return (
    <Container className="page">
      <Row className="mb-3">
        <Col>
          <h1 className="page-title text-center text-warning">All Products</h1>
        </Col>
        {/* <Col className={"products-to-show d-flex flex-row justify-content-end align-items-center"}  >
              <span>
                  Number of Products to Show
              </span>
              <input min={5} type={"number"} style={{width:'50px'}} value={productListLimit} onChange={(e:any)=>{setProductListLimit(e.target.value)}}/>
              <span>Showing: {productList.length}</span>
          </Col> */}
      </Row>
      <Row className="product-list">
        <Container>{productList}</Container>
      </Row>
    </Container>
  );
}

export default Products;
