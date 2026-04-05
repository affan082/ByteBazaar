export default interface ProductInterface {
  productId?: String;
  url?: string;
  sku?: String;
  name?: String;
  description?: String;
  shortDescription?: String;
  manufacturer?: String;
  featureImage?: String;
  gallery?: [String];
  price: Number;
  salePrice?: Number;
  categories?: [String];
  rating?: Number;
  stock?: Number;
  variations?: {
    color?: [String];
  };
  brand?: String;
  _id: string;
  [key: string]: any;
  paymentGateways: [
    {
      gateway: String;
      purchase_id: String;
    },
  ];
}
