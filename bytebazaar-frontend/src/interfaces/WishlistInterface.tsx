import ProductInterface from "./ProductInterface.tsx";

export interface WishlistItem {
  _id?: string;
  product: ProductInterface;
}

export interface WishlistApiResponse {
  success: boolean;
  wishlist: WishlistItem[];
  message?: string;
  isInWishlist?: boolean;
}

export interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

export type WishlistInterface = WishlistItem;
