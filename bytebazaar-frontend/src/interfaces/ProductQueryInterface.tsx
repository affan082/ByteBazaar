export interface ProductQueryInterface {
  keyword?: string;
  price?: {
    min?: Number;
    max?: Number;
  };
  rating?: {
    min?: Number;
    max?: Number;
  };
  categories?: string[];
  brands?: [string];
  inStock?: boolean;
  limit?: number;
  skip?: number;
}
