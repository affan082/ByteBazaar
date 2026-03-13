import {Stack} from "react-bootstrap";
import {Image} from "primereact/image";

interface ImageBoxProps {
    imageUrl?: string;
    heading?: string;
    description?: string;
    className?: string;
}

function ImageBox({ imageUrl, heading, description, className }: ImageBoxProps) {
    return (

        <Stack className={"image-box align-content-center justify-content-center "+className} direction={"horizontal"}>
            <Image className={"image-box-image-content"} src={imageUrl}/>
            <Stack className={"image-box-content-wrapper justify-content-center"}>
                <p className={"text-heading m-0"}>{heading}</p>
                <span className={"text-description"}>{description}</span>
            </Stack>
        </Stack>
    );
}

export default ImageBox;