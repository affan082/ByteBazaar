import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { GetProducts } from "../../queries/GetProducts.tsx";
import { Stack } from "react-bootstrap";
import "./styled-carousel.scss";
import "./carousel.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ProductQueryInterface } from "../../interfaces/ProductQueryInterface.tsx";

interface CarouselInterface<T extends CarouselItemProp> {
  data?: T[];
  query?: ProductQueryInterface;
  responsive?: ResponsiveType;
  TemplateComponent: React.ComponentType<T>;
  className?: string;
  itemsClassName?: string;
  infinite?: boolean;
  title?: string;
  taxonomyControls?: ReactElement[];
}

interface CarouselItemProp {
  _id: string | number;
  [key: string]: any;
}

const defaultResponsiveness = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function QueryableCustomCarousel<T extends CarouselItemProp>({
  data,
  query,
  responsive = defaultResponsiveness,
  TemplateComponent,
  itemsClassName,
  className,
  infinite = false,
  title,
  taxonomyControls,
}: CarouselInterface<T>) {
  // If neither data nor query is received, Then show empty message

  const [resultData, setResultData] = useState<T[]>([]);
  const currentActiveTaxonomy = useRef(null);
  useEffect(() => {
    if (data) {
      setResultData(data);
    } else if (query) {
      GetProducts(query).then((_data) => {
        setResultData(_data);
      });
    }
  }, [data, query]);

  if (!query && !data) {
    return <p className={"text-danger"}>Sorry, No Query or Data found.</p>;
  }

  const carouselItems = [];

  for (let i = 0; i < resultData.length; i++) {
    carouselItems.push(
      <Stack key={i} className={"carousel-item " + itemsClassName}>
        <TemplateComponent {...resultData[i]} />
      </Stack>
    );
  }

  function taxonomyClickHandler(event: Event): void {
    const target = event.target as HTMLElement | null; // Explicitly type event.target

    if (!target) return; // Prevents null errors

    const category = target.getAttribute("data-value");

    if (category) {
      if (currentActiveTaxonomy.current) {
        currentActiveTaxonomy.current.classList.toggle("active");
      }

      query.categories = [category.toString()]; // Ensure it's correctly typed as an array

      currentActiveTaxonomy.current = target; // Assign new active element safely
      currentActiveTaxonomy.current?.classList.toggle("active"); // Use optional chaining
      console.log(currentActiveTaxonomy.current, query.categories);
    }
  }

  return (
    <Stack className={"carousel-wrapper"}>
      <Stack className="carousel-controls ">
        <h5 className={"carousel-title"}>{title || "Products"}</h5>
        {taxonomyControls ? (
          <Stack className={"taxonomy-controls d-flex flex-row gap-1"}>
            {taxonomyControls?.map((item, idx) =>
              React.cloneElement(item, {
                className: "taxonomy-control",
                id: "taxonomy-control-" + (idx + 1),
                onClick: taxonomyClickHandler,
              })
            )}
          </Stack>
        ) : (
          <></>
        )}
      </Stack>
      <Carousel
        responsive={responsive}
        className={"carousel " + className}
        itemClass={itemsClassName}
        infinite={infinite}
      >
        {carouselItems}
      </Carousel>
    </Stack>
  );
}

export default QueryableCustomCarousel;
