import ProductInterface from "../../interfaces/ProductInterface";
import "./HomeSlideTemplate.css";

function HomeSlideTemplate(props: ProductInterface) {
  return (
    <div className="slide">
      <div className="boxed cont d-flex flex-row">
        <div className="left w-50 d-flex flex-column row-gap-5 justify-content-center">
          <h2 className="title">{props.name}</h2>
          <div className="button-cont d-flex column-gap-4">
            <a className="btn btn-secondary" href={"#link"}>
              Shop Now
            </a>
            <a
              className="btn btn-primary-outline"
              href={props.categoryId?.toString()}
            >
              View More
            </a>
          </div>
        </div>
        <div className="right w-50 d-flex flex-column justify-content-center position-relative">
          <img
            src={props.productImage?.toString()}
            alt=""
            className="mx-auto"
          />
          <div className="price-label p-3 d-flex justify-content-center align-items-center">
            only
            <br />${props.price?.toString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSlideTemplate;
