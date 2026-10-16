export default interface ProductInterface {
  productId?: string;
  url?: string;
  sku?: string;
  name?: string;
  description?: string;
  shortDescription?: string;
  manufacturer?: string;
  featureImage?: string;
  gallery?: [string];
  price: number;
  salePrice?: number;
  categories?: (string | { _id: string; name: string; slug?: string })[];
  rating?: number;
  stock?: number;
  variations?: {};
  brand?: string;
  _id: string;
  [key: string]: any;
  paymentGateways: [
    {
      gateway: string;
      purchase_id: string;
    },
  ];
}
