import { Container,Card, Carousel, Col, Row, Stack } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./aboutus.scss";

function Aboutus() {
  return (
    <>
      <Container className="aboutus-page">
        <Row >
          <Col>
            <h1 className="mt-2 aboutus-title text-warning ">About Us</h1>
          </Col>
        </Row>
        <Container className="gi-about-section">
        <Row>
          <Col>
          <h3 className="m-2">Who We <span className="text-warning">Are?</span> </h3></Col>
         <p className="mx-4 p-2 text-uppercase"> WE'RE HERE TO SERVE ONLY THE BEST PRODUCTS FOR YOU. ENRINCHING YOUR HOMES WITH THE BEST ESSENTIALS. </p>
          </Row>
          <Row>  
          <Col>
          <h3 className="m-2">What We <span className="text-warning">Offer:</span></h3>
          <p className="mx-4 p-2 text-uppercase"> From top-tier laptops and smartphones to innovative accessories and home tech, ByteBazaar
          curates a diverse collection of premium products. Every item in our
          store is carefully selected to meet the highest standards of quality,
          performance, and value. </p> </Col>
          </Row>
          <Row>
            <Col className="why-choose-bytebazaar">
          <h3 className="m-2">Why Choose <span className="text-warning">ByteBazaar?</span></h3>
          <ul className=" mx-4">
            <li>
             <span className="fw-bold"> Trusted Brands:</span> We partner with leading global brands to offer
              authentic, high-quality products.
            </li>
            <li>
              <span className="fw-bold"> Competitive Prices:</span> Experience the latest tech without breaking
              the bank
            </li>
            <li>
             <span className="fw-bold"> Exceptional Support:</span> Our dedicated customer support team is always
              here to assist you with personalized service.
            </li>
            <li>
             <span className="fw-bold"> Fast & Secure Shipping:</span> Enjoy hassle-free delivery with multiple
              shipping options.
            </li>
          </ul>
          <h3></h3>
          </Col>
          </Row>
        </Container>
        <section className="gi-service-section py-5">
            <Row>
              <Col>
                <h3 className="m-2">Our <span className="text-warning">Services</span></h3>
                <p className="mx-4 p-2 text-uppercase">Customer service should not be a department. It should be the entire company.</p>
              </Col>
            </Row>
            <Row className="mx-4">
              <Col sm={6} md={6} lg={3} className="p-tp-12">
                <Card className="gi-ser-inner" >
                  <Card.Body className="d-flex flex-column fs-6 align-items-center">
                    <div className="gi-service-icon">
                      <i className="bi bi-truck text-warning" ></i>
                    </div>
                    <Card.Title >Free Shipping</Card.Title>
                    <Card.Text className="fw-light">Free shipping on all US order or order above $200</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={6} lg={3} className="p-tp-12">
                <Card className="gi-ser-inner" >
                  <Card.Body className=" d-flex flex-column fs-6 align-items-center">
                    <div className="gi-service-icon">
                      <i className="bi bi-hand-thumbs-up text-warning" style={{ fontSize: '3rem', display: 'block', textAlign: 'center' }}></i>
                    </div>
                    <Card.Title>24X7 Support</Card.Title>
                    <Card.Text className="fw-light">Contact us 24 hours a day, 7 days a week</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={6} lg={3} className="p-tp-12 ">
                <Card className="gi-ser-inner" >
                  <Card.Body className=" d-flex flex-column  ">
                    <div className="gi-service-icon">
                      <i className="bi bi-tags text-warning" ></i>
                    </div>
                    <Card.Title>30 Days Return</Card.Title>
                    <Card.Text className="fw-light">Simply return it within 30 days for an exchange</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} md={6} lg={3} className="p-tp-12">
                <Card className="gi-ser-inner" >
                  <Card.Body className=" d-flex flex-column fs-6 align-items-center">
                    <div className="gi-service-icon">
                      <i className="bi bi-lock text-warning" ></i>
                    </div>
                    <Card.Title>Payment Secure</Card.Title>
                    <Card.Text className="fw-light">Contact us 24 hours a day, 7 days a week</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          
        </section>
          <Row className="m-4 aboutus-client-review"> <Col>
          <h3 className="my-2 ">Our Customers <span className="text-warning">Feedback?</span></h3>
           <Carousel className="client-review-carousel p-5 shadow" indicators={false} fade  >
      <Carousel.Item >
      <Stack direction={"horizontal"} className="client-review-container" >
                        <img className={"client-img w-20 "} src={"/public/assets/96-testimol.png"}></img>
                        <h5 className={"client-name w-50"}>Sandy Wilcke</h5>
                    </Stack>
                    <i className={"review-quote-icon-start bi bi-quote"}></i>
                    <Stack>
                        <p className={"client-review"}>
                            Lorem ipsum dolor sit amet consectetur adipiscing elit, interdum velit libero est
                            venenatis id mattis, ridiculus rhoncus porttitor fringilla rutrum sem.
                        </p>
                    </Stack>
       
      </Carousel.Item>
      <Carousel.Item>
      <Stack direction={"horizontal"} className="client-review-container" >
                        <img className={"client-img w-20"} src={"/assets/Ellipse 4.png"}></img>
                        <h5 className={"client-name w-50"}>Alice Bob</h5>
                    </Stack>
                    <i className={"review-quote-icon-start bi bi-quote"}></i>
                    <Stack>
                        <p className={"client-review"}>
                            Lorem ipsum dolor sit amet consectetur adipiscing elit, interdum velit libero est
                            venenatis id mattis, ridiculus rhoncus porttitor fringilla rutrum sem.
                        </p>
                    </Stack>
      </Carousel.Item>
      <Carousel.Item>
      <Stack direction={"horizontal"} className="client-review-container" >
                        <img className={"client-img w-20 "} src={"/public/assets/96-testimol.png"}></img>
                        <h5 className={"client-name w-50"}>Sandy Wilcke</h5>
                    </Stack>
                    <i className={"review-quote-icon-start bi bi-quote"}></i>
                    <Stack>
                        <p className={"client-review"}>
                            Lorem ipsum dolor sit amet consectetur adipiscing elit, interdum velit libero est
                            venenatis id mattis, ridiculus rhoncus porttitor fringilla rutrum sem.
                        </p>
                    </Stack>
                    <i className={"review-quote-icon-end bi bi-quote-end"}></i>
      </Carousel.Item>
    </Carousel>
    </Col></Row>
        <Row className="m-4">
          <Col className="d-flex  justify-content-center">
            <h5 className="m-4">Contact Us For inquiries, feel free to reach out:</h5>
          </Col>
        </Row>
        <Row className="m-3" >
          <Col
            xs={6}
            className="d-flex  justify-content-center ">
            <h5 >Email: info@bytebazaar.com</h5>
          </Col>
          <Col
            xs={6}
            className="d-flex  justify-content-center">
            <h5>Phone: +92-325-752-4473</h5>
          </Col>
        </Row>
      </Container>
   
    </>
  );
}
export default Aboutus;
