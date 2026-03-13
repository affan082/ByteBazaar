import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import HomeSlideTemplate from "../carousel-slide-templates/HomeSlideTemplate";
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
import "./carousel.scss";
import { HeroCarouselProp } from "../carousel-slide-templates/HomeSlideTemplate";

function HeroCarousel({ _products }: { _products: HeroCarouselProp[] }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      controls={true}
      indicators={true}
      variant="dark"
      prevIcon={null}
      nextIcon={null}
      className="round-indicators primary-indicators secondary-indicators"
    >
      {_products.map((product, idx) => (
        <Carousel.Item key={idx}>
          <HomeSlideTemplate
            title={product.title}
            link={product.link}
            category={product.category}
            imageURL={product.imageURL}
            price={product.price}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default HeroCarousel;
