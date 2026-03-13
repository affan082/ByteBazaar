import {ProductQueryInterface} from "./ProductQueryInterface.tsx";

export default interface FiltersInterface {
    title?: string;
    queryObject: ProductQueryInterface;
    queryUpdater: (query: {
        keyword?: String;
        price?: { min?: Number; max?: Number };
        rating?: { min?: Number; max?: Number };
        categories?: String[];
        brands?: [String];
        inStock?: Boolean;
        size?: String[];
        color?: String[];
        limit?: number;
        priceMin: number;
        priceMax: number
    }) => void;
    range?:{
        min:number,
        max:number
    }
}