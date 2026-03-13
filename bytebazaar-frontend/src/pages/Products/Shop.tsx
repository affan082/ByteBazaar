import React, { useState } from "react";
import "../../global/global-css.css";
import "./products.css";

const ProductPage: React.FC = () => {
  const [filters, setFilters] = useState({
    allCategories: true,
    tablet: false,
    laptop: false,
    headphones: false,
    console: false,
    other: false,
    inStock: false,
    outOfStock: false,
    smartWatch: false,
    samsung: false,
    apple: false,
    sizeM: false,
    sizeS: false,
    sizeL: false,
    sizeXL: false,
    sizeXXL: false,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const resetFilters = () => {
    setFilters({
      allCategories: true,
      tablet: false,
      laptop: false,
      headphones: false,
      console: false,
      other: false,
      inStock: false,
      outOfStock: false,
      smartWatch: false,
      samsung: false,
      apple: false,
      sizeM: false,
      sizeS: false,
      sizeL: false,
      sizeXL: false,
      sizeXXL: false,
    });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="sidebar container">
            <h5>
              Categories
              <button
                onClick={resetFilters}
                className="btn btn-link p-0 text-decoration-none"
              >
                Reset
              </button>
            </h5>
            <ul className="list-unstyled">
              <li>
                <input
                  type="checkbox"
                  name="allCategories"
                  checked={filters.allCategories}
                  onChange={handleCheckboxChange}
                />{" "}
                All categories <span className="badge badge-secondary">30</span>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="tablet"
                  checked={filters.tablet}
                  onChange={handleCheckboxChange}
                />{" "}
                Tablet <span className="badge badge-secondary">5</span>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="laptop"
                  checked={filters.laptop}
                  onChange={handleCheckboxChange}
                />{" "}
                Laptop <span className="badge badge-secondary">5</span>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="headphones"
                  checked={filters.headphones}
                  onChange={handleCheckboxChange}
                />{" "}
                Headphones <span className="badge badge-secondary">5</span>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="console"
                  checked={filters.console}
                  onChange={handleCheckboxChange}
                />{" "}
                Console <span className="badge badge-secondary">5</span>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="other"
                  checked={filters.other}
                  onChange={handleCheckboxChange}
                />{" "}
                Other <span className="badge badge-secondary">5</span>
              </li>
            </ul>
            <hr />
            <h5>Availability</h5>
            <ul className="list-unstyled">
              <li>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={filters.inStock}
                  onChange={handleCheckboxChange}
                />{" "}
                In stock <span className="badge badge-secondary">20</span>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="outOfStock"
                  checked={filters.outOfStock}
                  onChange={handleCheckboxChange}
                />{" "}
                Out of stock
              </li>
            </ul>
            <hr />
            <h5>Product Type</h5>
            <ul className="list-unstyled">
              <li>
                <input
                  type="checkbox"
                  name="smartWatch"
                  checked={filters.smartWatch}
                  onChange={handleCheckboxChange}
                />{" "}
                Smart-watch <span className="badge badge-secondary">5</span>
              </li>
            </ul>
            <hr />
            <h5>Brand</h5>
            <ul className="list-unstyled">
              <li>
                <input
                  type="checkbox"
                  name="samsung"
                  checked={filters.samsung}
                  onChange={handleCheckboxChange}
                />{" "}
                Samsung <span className="badge badge-secondary">10</span>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="apple"
                  checked={filters.apple}
                  onChange={handleCheckboxChange}
                />{" "}
                Apple <span className="badge badge-secondary">5</span>
              </li>
            </ul>
            <hr />
            <h5>Color</h5>
            <ul className="colors">
              <span className="color-dot red"></span>
              <span className="color-dot blue"></span>
              <span className="color-dot green"></span>
              <span className="color-dot yellow"></span>
              <span className="color-dot purple"></span>
              <span className="color-dot orange"></span>
              <span className="color-dot black"></span>
              <span className="color-dot white"></span>
            </ul>
            <hr />
            <h5>Size</h5>
            <ul className="list-unstyled">
              <li>
                <input
                  type="checkbox"
                  name="sizeM"
                  checked={filters.sizeM}
                  onChange={handleCheckboxChange}
                />{" "}
                M
              </li>
              <li>
                <input
                  type="checkbox"
                  name="sizeS"
                  checked={filters.sizeS}
                  onChange={handleCheckboxChange}
                />{" "}
                S
              </li>
              <li>
                <input
                  type="checkbox"
                  name="sizeL"
                  checked={filters.sizeL}
                  onChange={handleCheckboxChange}
                />{" "}
                L
              </li>
              <li>
                <input
                  type="checkbox"
                  name="sizeXL"
                  checked={filters.sizeXL}
                  onChange={handleCheckboxChange}
                />{" "}
                XL
              </li>
              <li>
                <input
                  type="checkbox"
                  name="sizeXXL"
                  checked={filters.sizeXXL}
                  onChange={handleCheckboxChange}
                />{" "}
                XXL
              </li>
            </ul>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9">
          <div className="row">
            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/Frame 29.svg"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Wireless Headphones</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/Frame 29-1.svg"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Play Games</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/Frame 29-.svg"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Laptop</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/Frame 29.svg"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Wireless Headphones</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/thumb.png"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Play Games</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/Frame 29-.svg"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Laptop</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/Frame 29.svg"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Wireless Headphones</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/Frame 29-1.svg"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Play Games</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/Frame 29-.svg"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Laptop</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/thumb.png"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Wireless Headphones</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/Frame 29-1.svg"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Play Games</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-4 mb-4">
              <div className="card product-card">
                <img
                  src="/assets/..\"
                  className="card-img-top"
                  alt="Product Image"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Laptop</h5>
                  <p className="card-text">$11.70</p>
                  <div className="rating">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="col-lg-12 col-sm-4 mb-4">
          <div className="banner m-5">
            <button className="btn btn-warning">New laptop</button>
            <h2>Sale up to 50% off</h2>
            <p>12 inch HD Display</p>
            <button className="btn btn-primary">Shop now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
