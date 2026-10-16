import { ProductQueryInterface } from "./ProductQueryInterface.tsx";

export default interface FiltersInterface {
  title?: string;
  queryObject: ProductQueryInterface;
  queryUpdater: (query: {
    keyword?: string;
    price?: { min?: Number; max?: Number };
    rating?: { min?: Number; max?: Number };
    categories?: string[];
    brands?: [string];
    inStock?: boolean;
    limit?: number;
    priceMin?: number;
    priceMax?: number;
  }) => void;
  range?: {
    min: number;
    max: number;
  };
}
