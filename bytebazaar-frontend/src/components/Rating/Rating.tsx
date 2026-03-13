import { Stack } from "react-bootstrap";
import {ReactNode} from "react";
import "./rating.scss";
interface Prop{
    rating: number;
    key:string;
    // onStarSVG?:string;
    // offStarSVG?:string;
    // halfStarSVG?:string;
}

function Rating({rating}: Prop){
    const ratingStars:ReactNode[] = [];
    for(let i=0; i<5; i++){
        ratingStars.push(<div className={`rating-star bi bi-star-fill ${i<rating?"filled":""}`} key={i.toString()}></div>)
    }
return (
    <Stack className="rating" direction={"horizontal"}>
        {ratingStars}
    </Stack>
);
}

export default Rating