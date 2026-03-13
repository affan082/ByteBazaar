export interface ProductQueryInterface {
  keyword?: String;
  price?: {
    min?: Number;
    max?: Number;
  };
  rating?: {
    min?: Number;
    max?: Number;
  };
  categories?: String[];
  brands?: [String];
  inStock?: Boolean;
  size?: String[];
  color?: String[];
  limit?: number;
  skip?: number;
}
