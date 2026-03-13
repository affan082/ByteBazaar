import { Col, Container, Row, Stack } from "react-bootstrap";
import "./home.scss";
import { useContext } from "react";
// import CategoryMenu from "../../menus/CategoryMenu";
import HomeSilderTemplate from "../../templates/HomeSilderTemplate";
import QueryableCustomCarousel from "../../components/carousel/QueryableCustomCarousel";
import ProductCarouselTemplate_1 from "../../templates/ProductCarouselTemplate1.tsx";
// import ProductCarouselTemplate_2 from "../../templates/ProductCarouselTemplate2.tsx";
// import Header from "../../components/header/Header";
import { ConfigContext } from "../../reducers/GlobalConfig";
import Section_3 from "./Sections/Section_3.tsx";
import QueryableLoopGrid from "../../components/Queryable Loop Grid/QueryableLoopGrid.tsx";
import LoopGridTemplate2 from "../../templates/LoopGridTemplate2.tsx";
// import Carousel from "react-bootstrap/Carousel";
// import HomePageReviews from "../../templates/HomePageReviews.tsx";
import FeaturesSection from "./Sections/FeaturesSection.tsx";
import { carouselResponsiveTemplate } from "../../utils/carouselslideconfig.tsx";
// import Footer from "../../components/footer/Footer.tsx";
//import { ProductQueryInterface } from "../../interfaces/ProductQueryInterface";
//import { GetProducts } from "../../queries/GetProducts";
//import ProductInterface from "../../interfaces/ProductInterface";

function Home() {
  const config = useContext(ConfigContext);

  return (
    <>
      <Container className="page page-home" fluid>
        <Row className="content-box">
          <Container className="page-section">
            <Row className="">
              <Container className="gap-4 align-items-start">
                {/*Hero Section*/}
                <Row>
                  {/*<Col className="category-menu-cont mb-3" xl={2} lg={3} sm={12}>*/}
                  {/*  <CategoryMenu />*/}
                  {/*</Col>*/}
                  <Col className={""} xxl={10} lg={10} sm={12}>
                    <HomeSilderTemplate
                      _id={"fff"}
                      name={"Product"}
                      price={50}
                      productId={"111"}
                      productImage={config.server.uri + "placholder_image.svg"}
                      paymentGateways={[]}
                    />
                  </Col>
                  <Col
                    xxl={2}
                    lg={2}
                    gap={3}
                    md={12}
                    className="advertisement-cont d-flex flex-column gap-2 d-xl-flex d-none d-lg-flex"
                  >
                    <div className="advertisement ">
                      <img src={"/assets/img1_home2.jpg"} alt="" />
                    </div>
                    <div className="advertisement ">
                      <img src={"/assets/img2_home2.jpg"} alt="" />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Container>
        </Row>
        <Row className="content-box">
          <Container className="page-section two-columns">
            <Row
              className="d-flex flex-nowrap gap-5 gap-xl-3 order-xs-2"
              style={{ boxSizing: "border-box" }}
            >
              <Col xxl={2} lg={2} className={" d-none d-lg-block"}>
                <Container className={"p-0 d-flex flex-column gap-0"}>
                  <Row className={""}>
                    <QueryableCustomCarousel
                      query={{ limit: 4 }}
                      TemplateComponent={ProductCarouselTemplate_1}
                      className={"styled-carousel p-0"}
                      infinite
                      responsive={{
                        desktop: {
                          slidesToSlide: 1,
                          breakpoint: {
                            max: 9999,
                            min: 0,
                          },
                          items: 1,
                        },
                      }}
                      title={"Best Choices"}
                    />
                  </Row>
                  <Row className={"  page-section-inner"}>
                    <Stack className={"advertisement-cont"}>
                      <img
                        src={"/assets/img_left.jpg"}
                        alt={""}
                        className={"home-advertisement-image"}
                      ></img>
                    </Stack>
                  </Row>
                  <Row className={" page-section-inner"}>
                    <h4>
                      <span className={""}>Popular</span> Products
                    </h4>
                    <QueryableLoopGrid
                      query={{ limit: 4 }}
                      columns={{
                        desktop: 1,
                      }}
                      gap={15}
                      TemplateComponent={LoopGridTemplate2}
                      limits={{
                        desktop: 4,
                      }}
                      className={"p-0"}
                    />
                  </Row>
                </Container>
              </Col>
              <Col xxl={10} lg={10}>
                <Container className="mx-0 w-100 page-column-right" fluid>
                  <Row className="d-flex p-0">
                    <FeaturesSection />
                  </Row>
                  <Row className={"mb-3 mb-md-0"}>
                    <Section_3 />
                  </Row>
                  <Row
                    className={"page-section-inner three-advertisement px-0"}
                  >
                    <Col xs={3} className={"p-0"}>
                      <a href={"#"}>
                        <img
                          src={"/assets/img3_home2.jpg"}
                          alt={""}
                          className={"home-advertisement-image"}
                        />
                      </a>
                    </Col>
                    <Col xs={6} className={"px-3"}>
                      <a href={"#"}>
                        <img
                          src={"/assets/img4_home2.jpg"}
                          alt={""}
                          className={"home-advertisement-image"}
                        />
                      </a>
                    </Col>
                    <Col xs={3} className={"p-0"}>
                      <a href={"#"}>
                        <img
                          src={"/assets/img5_home2.jpg"}
                          alt={""}
                          className={"home-advertisement-image"}
                        />
                      </a>
                    </Col>
                  </Row>
                  <Row className={"page-section-inner"}>
                    <Stack className="carousel-with-categories px-0">
                      <QueryableCustomCarousel
                        query={{ limit: 12, skip: 5 }}
                        TemplateComponent={ProductCarouselTemplate_1}
                        className={"styled-carousel p-0"}
                        itemsClassName={"px-1"}
                        infinite={true}
                        responsive={carouselResponsiveTemplate}
                      />
                    </Stack>
                  </Row>
                  <Row className={"page-section-inner"}>
                    <Stack className="carousel-with-categories p-0">
                      {/*<QueryableCustomCarousel*/}
                      {/*    carouselTitle="Security Cameras"*/}
                      {/*    query={{ limits: 8, skip:10}}*/}
                      {/*    TemplateComponent={ProductCarouselTemplate_2}*/}
                      {/*    slidesToShow={4}*/}
                      {/*    indicators={false}*/}
                      {/*    className="styled-carousel"*/}
                      {/*/>*/}
                      <QueryableCustomCarousel
                        query={{ limit: 12, skip: 10 }}
                        TemplateComponent={ProductCarouselTemplate_1}
                        className={"styled-carousel p-0"}
                        itemsClassName={"px-1"}
                        infinite={true}
                        responsive={carouselResponsiveTemplate}
                      />
                    </Stack>
                  </Row>
                  <Row className={"page-section-inner"}>
                    <Stack className="carousel-with-categories p-0">
                      <QueryableCustomCarousel
                        query={{ limit: 12, skip: 15 }}
                        TemplateComponent={ProductCarouselTemplate_1}
                        className={"styled-carousel p-0"}
                        itemsClassName={"px-1"}
                        infinite={true}
                        responsive={carouselResponsiveTemplate}
                      />
                    </Stack>
                  </Row>
                  <Row className={"page-section-inner"}>
                    <Col className={"p-0"}>
                      <img
                        src={"/assets/img6_home2.jpg"}
                        alt={"Advertisement Banner"}
                        className={"w-100"}
                        style={{ minHeight: "150px", objectFit: "cover" }}
                      />
                    </Col>
                  </Row>
                  <Row className={"page-section-inner"}>
                    <QueryableLoopGrid
                      query={{ limit: 12, skip: 12 }}
                      TemplateComponent={ProductCarouselTemplate_1}
                      columns={{
                        desktop: 5,
                        laptop_large: 5,
                        laptop: 4,
                        tablet: 2,
                        mobile: 2,
                      }}
                      gap={20}
                      limits={{
                        desktop: 10,
                        laptop_large: 10,
                        laptop: 8,
                        tablet: 8,
                        mobile: 10,
                      }}
                      title={"Featured Products"}
                    />
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    </>
  );
}

export default Home;
