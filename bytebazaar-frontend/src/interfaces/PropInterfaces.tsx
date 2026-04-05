// Category Interface
export interface CategoryProps {
  categoryID: number;
  categoryName: string;
  numberOfProductsSold: number;
}

// Product Interface
export interface ProductProps {
  productID: number;
  productSKU: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productSalePrice: number;
  productCategoryID: number;
  rating: number;
  productStock: number;
  productVariations: string;
}

// // User Interface
// export interface UserProps {
//   userData: {
//     userID: number;
//     fullname: string;
//     username: string;
//     passwordHash: string;
//     dob: Date;
//     gender: string;
//     address: string;
//     profileImageUrl: string;
//   };
//   signin: Function;
//   signup: Function;
// }

// User Interface
export interface UserProps {
  userID: number;
  fullname: string;
  username: string;
  passwordHash: string;
  dob: Date;
  gender: string;
  address: string;
  profileImageUrl: string;
}

// Order Interface
export interface OrderProps {
  orderID: number;
  orderDate: Date;
  productID: number;
  userID: number;
  orderAmount: number;
  productCount: number;
  orderTime: string;
  orderStatus: string;
  orderShipping: string;
}

// Review Interface
export interface ReviewProps {
  orderID: number;
  productID: number;
  customerName: string;
  customerImage: string;
  reviewText: string;
  rating: number;
}
