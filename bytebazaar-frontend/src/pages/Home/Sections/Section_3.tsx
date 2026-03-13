import {Stack} from "react-bootstrap";
import QueryableCustomCarousel from "../../../components/carousel/QueryableCustomCarousel.tsx";
import ProductCarouselTemplate_1 from "../../../templates/ProductCarouselTemplate1.tsx";
import {carouselResponsiveTemplate} from "../../../utils/carouselslideconfig.tsx";

function Section_3(){

    return(
        <Stack className="carousel-with-categories page-section-inner px-0">
            <QueryableCustomCarousel
                query={{ limit: 12, skip:3 }}
                TemplateComponent={ProductCarouselTemplate_1}
                className="styled-carousel"
                itemsClassName={"px-1"}
                title={"Fresh Items"}
                responsive={carouselResponsiveTemplate}
                infinite={true}
            />
        </Stack>);
}

export default Section_3