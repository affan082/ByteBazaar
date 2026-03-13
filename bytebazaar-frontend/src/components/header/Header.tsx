import { useContext, useState } from "react";
import { ConfigContext } from "../../reducers/GlobalConfig";
import "bootstrap/dist/css/bootstrap.css";
import "./header.scss";
import {
  Col,
  Container,
  Row,
  Stack,
  Form,
  InputGroup,
  Button,
  Navbar,
  NavLink,
  Nav,
  Modal,
  NavDropdown,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { UserContext } from "../../reducers/UserContext.tsx";
// import CartIcon from "../Widgets/cart/CartIcon.tsx";
import menu from "../../menus/header_menu.json";

function Header() {
  const config = useContext(ConfigContext);
  const urls = config.app.urls;
  const { user } = useContext(UserContext);
  const [query, setQuery] = useState({
    category: "",
    keyword: "",
  });
  const [showSearch, setShowSearch] = useState(false);
  const cartCount = user?.cart?.length || 0;
  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <Container fluid className="header">
      <Row className="header-top py-3 content-box">
        <Col>
          <Stack direction="horizontal" gap={4}>
            <p className="email">Email: {config.contact.email}</p>
            <p className="promotion">{config.app.header_promotion_message}</p>
          </Stack>
        </Col>
      </Row>

      <Row className="header-main content-box py-3 d-flex flex-row align-items-center flex-nowrap gap-0 justify-content-md-between">
        {/* Logo */}
        <Col className="logo-cont" lg={3} md={3} sm={3} xs={6}>
          <img
            src={config.app.app_logo_light}
            alt="logo"
            className="logo"
            style={{ filter: "brightness(0)" }}
          />
        </Col>

        <Col className="header-search-cont d-none d-lg-flex" lg={6} xs={6}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/shop${
                query.category ? `/${query.category}` : ""
              }${query.keyword ? `?search=${query.keyword}` : ""}`;
            }}
            className="d-flex flex-row align-items-center justify-content-center gap-2"
            style={{ width: "100%" }}
          >
            <InputGroup className="d-flex gap-0 filter-group">
              <Form.Select
                name="category-selector"
                className="category-selector px-3"
                size="sm"
                onChange={(e) =>
                  setQuery({
                    ...query,
                    category: e.target.value,
                  })
                }
              >
                <option value="">All Categories</option>
                {menu.map((cat) => {
                  const items = [];
                  items.push(
                    <option key={cat.slug} value={cat.slug}>
                      {cat.title}
                    </option>,
                  );
                  if (cat.items) {
                    cat.items.map((item, index) => {
                      items.push(
                        <option key={index} value={item.slug}>
                          {item.title}
                        </option>,
                      );
                    });
                  }
                  return items;
                })}
              </Form.Select>
              <Form.Control
                placeholder="What are you looking for?"
                aria-label="Header Keyword Searchbar"
                className="search"
                value={query.keyword}
                onChange={(e) =>
                  setQuery({
                    ...query,
                    keyword: e.target.value.trim(),
                  })
                }
              />
              <Button className="search-submit">Search</Button>
            </InputGroup>
          </Form>
        </Col>

        <Col
          className="d-flex flex-row align-items-center justify-content-end gap-2"
          lg={3}
          md={3}
          xs={6}
        >
          <Stack direction="horizontal" className="controls gap-2">
            <span
              className="header-icon d-lg-none"
              role="button"
              onClick={() => setShowSearch(true)}
            >
              <i className="bi bi-search display-2"></i>
            </span>

            <a
              className="wishlist-cont  header-icons d-flex justify-content-center align-items-center gap-1"
              href="/wishlist"
            >
              <i className="bi bi-heart ms-3 me-1"></i>
              <span className="d-none d-lg-flex">Wishlist</span>
              {/* <span className="count wishlist-count ">{wishlistCount}</span> */}
            </a>
            <a
              className="wishlist-cont header-icons d-flex justify-content-center align-items-center gap-1"
              href="/cart"
            >
              <i className="bi bi-cart ms-3 me-1"></i>
              <span className="d-none d-lg-flex">Cart</span>
              {/* <span className="count cart-count ">{cartCount}</span> */}
            </a>

            {/* <CartIcon /> */}

            <span className="header-icon">
              {!user ? (
                <a href={urls.signin}>
                  <i className="bi bi-person"></i>
                </a>
              ) : (
                <a href={urls.profile}>
                  <i className="bi bi-person"></i>
                </a>
              )}
              {user ? (
                Object.keys(user).length > 0 ? (
                  <a href={urls.profile} className="d-none d-lg-inline">
                    {user.username || ""}
                  </a>
                ) : (
                  <a href={urls.signin} className="d-none d-lg-inline">
                    Sign In
                  </a>
                )
              ) : (
                ""
              )}
            </span>
          </Stack>
        </Col>
      </Row>

      <Row className="content-box nav-bar">
        <Col>
          <Stack>
            <Navbar className="p-0" sticky="top">
              <Nav>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/shop">Shop</NavLink>
                {menu.map((cat, idx) => (
                  <NavDropdown
                    title={cat.title}
                    id={`nav-dropdown-${idx}`}
                    key={cat.slug}
                  >
                    {cat.items.map((item) => (
                      <NavDropdown.Item
                        as={NavLink}
                        key={item.slug}
                        href={`/shop/${item.slug}`}
                      >
                        {item.title}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                ))}
              </Nav>
            </Navbar>
          </Stack>
        </Col>
      </Row>

      {/* Toasts */}
      <Row className="toast-wrapper">
        <ToastContainer autoClose={2} className="add-to-cart-toast" />
      </Row>

      <Modal
        show={showSearch}
        onHide={() => setShowSearch(false)}
        centered
        className="search-modal"
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Search Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <Form.Control
              placeholder="What are you looking for?"
              aria-label="Header Keyword Searchbar"
              className="search"
            />
            <Button className="search-submit">Search</Button>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Header;
