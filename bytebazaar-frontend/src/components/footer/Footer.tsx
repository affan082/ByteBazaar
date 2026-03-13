import {
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  FormControl,
  Stack,
} from "react-bootstrap";
import "./footer.scss";
import { useContext } from "react";
import { ConfigContext } from "../../reducers/GlobalConfig.tsx";
import menu from "../../menus/header_menu.json";

function Footer() {
  const config = useContext(ConfigContext);
  return (
    <Container className="footer page-section mt-5" fluid={true}>
      <Row
        className={
          "footer-upper-section content-box py-5 gap-1 flex justify-content-between"
        }
      >
        <Col xl={3} lg={6}>
          <h4>Sign Up For Newsletters</h4>
          <p>Be the First to Know. Sign up for newsletter today</p>
        </Col>
        <Form
          as={Col}
          xl={5}
          lg={5}
          className={"newsletter-form d-flex flex-row align-items-center"}
        >
          <InputGroup
            className={
              "d-flex flex-row align-items-center justify-content-between gap-0"
            }
          >
            <FormControl type={"email"} placeholder={"Your Email Address"} />
            <FormControl type={"submit"} value={"Sign Up"} />
          </InputGroup>
        </Form>
        <Col
          xl={3}
          lg={4}
          className={
            "social-icons d-flex flex-row align-items-center justify-content-end mt-lg-2"
          }
        >
          <div className={"social-icon twitter"}>
            <i className="bi bi-twitter"></i>
          </div>
          <div className={"social-icon instagram"}>
            <i className="bi bi-instagram"></i>
          </div>
          <div className={"social-icon facebook"}>
            <i className="bi bi-facebook"></i>
          </div>
          <div className={"social-icon youtube"}>
            <i className="bi bi-youtube"></i>
          </div>
        </Col>
      </Row>
      <Row className={"footer-main-section content-box py-md-5"}>
        <Col className={"pb-4 order-md-1"} lg={4} md={6}>
          <Stack className={"gap-3"}>
            <a href={"/"}>
              <img className={"logo"} src={config.app.app_logo} alt="logo" />
            </a>
            <p className={"company-description mb-3 w-75"}>
              ByteBazaar is a multi-vendor ecommerce platform that allows you to
              sell your products online.
            </p>
          </Stack>
        </Col>
        <Col className={"pb-4 order-md-3"} lg={2} md={6}>
          <h5>Popular Categories</h5>
          <ul className={"p-0"}>
            {menu[0].items.map((item) => {
              return (
                <li key={item.slug}>
                  <a href={"/shop/" + item.slug}>{item.title}</a>
                </li>
              );
            })}
          </ul>
        </Col>
        <Col className={"pb-4 order-md-4"} lg={2} md={6}>
          <h5>Browse More</h5>
          <ul className={"p-0"}>
            {menu.map((item) => {
              return (
                <li key={item.slug}>
                  <a href={"/shop/" + item.slug}>{item.title}</a>
                </li>
              );
            })}
          </ul>
        </Col>
        <Col className={"pb-4 order-md-2 "} lg={4} md={6}>
          <h5>Contact Us</h5>
          <p className={"contact-detail address"}>
            <span>Address: </span>
            {config.contact.address}
          </p>
          <p className={"contact-detail email"}>
            <span>Email: </span>
            {config.contact.email}
          </p>
          <p className={"contact-detail phone"}>
            <span>Phone: </span>
            {config.contact.phone}
          </p>
        </Col>
      </Row>
      <Row
        className={
          "footer-bottom-section content-box py-2 gap-4 justify-content-center"
        }
      >
        <div className={"divider"}></div>
        <Col className={"d-flex justify-content-center"}>
          <p className={"copyright"}>
            Copyright @ {config.app.year}{" "}
            <span className={"app-name"}>{config.app.app_name}</span>. All
            Rights Reserved
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
