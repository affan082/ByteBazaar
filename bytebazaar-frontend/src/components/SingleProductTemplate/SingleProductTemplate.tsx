import { Container, Row, Col, Stack } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../reducers/GlobalConfig";
import "./single-product-template.scss";
import { GetProducts } from "../../queries/GetProducts";
import ProductInterface from "../../interfaces/ProductInterface";
import { useParams } from "react-router-dom";
import QueryableCustomCarousel from "../carousel/QueryableCustomCarousel";
import ProductCarouselTemplate_1 from "../../templates/ProductCarouselTemplate1";
import NotFound from "../../pages/NotFound/NotFound.tsx";
import ProductTabs from "../ProductTabs/ProductTabs.tsx";
import ProductDetails from "./ProductDetails.tsx";
import SpinnerComponent from "../spinner/Spinner.tsx";
import { carouselResponsiveTemplate } from "../../utils/carouselslideconfig.tsx";

function SingleProductTemplate() {
  const { slug } = useParams();
  const config = useContext(ConfigContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [productData, setProductData] = useState<ProductInterface>();

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
    return <SpinnerComponent />;
  } else if (!productData) return <NotFound />;

  return (
    <>
      <Container fluid className="single-product-template page product-page">
        <Row className={"page-section content-box"}>
          <Col md={6} sm={12}>
            <Stack direction="horizontal" className="product-images gap-2">
              <Stack direction="horizontal" className="thumbnail-images gap-2">
                {productData.gallery?.map((image, index) => (
                  <img
                    key={`${index}-${image}`}
                    src={`${config.server.uri}${image}`}
                    alt=""
                    className="thumbnail"
                    onClick={() => window.open(`${config.server.uri}${image}`)}
                  />
                ))}
              </Stack>
              <div className="main-image-container">
                <img
                  src={`${productData.featureImage}`}
                  alt=""
                  className="main-image"
                  onClick={() => window.open(`${productData.featureImage}`)}
                />
              </div>
            </Stack>
          </Col>
          <ProductDetails activeTab={activeTab} setActiveTab={setActiveTab} />
        </Row>
        <Row className={"page-section content-box"}>
          <ProductTabs
            productData={productData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Row>
        <Row className={"page-section content-box"}>
          <Col md={12}>
            <section className="related-products-section mt-5">
              <QueryableCustomCarousel
                title="Related Products"
                TemplateComponent={ProductCarouselTemplate_1}
                query={{
                  limit: 10,
                  categories: productData.categoryId?.toString(),
                }}
                responsive={carouselResponsiveTemplate}
                className="styled-carousel related-products-carousel"
                infinite={true}
              />
            </section>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default SingleProductTemplate;
