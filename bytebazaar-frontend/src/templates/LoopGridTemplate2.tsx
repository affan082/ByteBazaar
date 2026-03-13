import {Stack} from "react-bootstrap";
import ProductInterface from "../interfaces/ProductInterface.tsx";
import "./product-carousel-template-1.scss";
import "./loop-grid-template-2.scss";
import Price from "../components/Price/Price.tsx";


function LoopGridTemplate2({featureImage,name,price,salePrice, url}:ProductInterface) {
return (
    <Stack direction={"horizontal"} className={"loop-grid-template-2 flex-nowrap p-2"}>
        <a href={url} className={"product-feature-image-wrapper"}><img className={"product-feature-image  w-100"} src={featureImage?.toString()} alt={""}/></a>
        <Stack className={"product-description-wrapper justify-content-center gap-2"} direction={"vertical"}>
            <a href={url} className={"product-name"}>{name}</a>
            <Price price={price} salePrice={salePrice} className={"price-small"}/>
        </Stack>
    </Stack>
);
}

export default LoopGridTemplate2;