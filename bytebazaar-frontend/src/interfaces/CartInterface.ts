import ProductInterface from "./ProductInterface.tsx";


export interface CartItem {
    _id?: string;
    product: ProductInterface;
    quantity: number;
    total?: number;
    addedAt?: string;
}


export interface CartSummary {
    totalItems: number;
    totalPrice: number;
    cartCount: number;
}


export interface CartApiResponse {
    success: boolean;
    cart: CartItem[];
    summary: CartSummary;
    message?: string;
}


export interface CartState {
    items: CartItem[];
    summary: CartSummary;
    loading: boolean;
    error: string | null;
}


export type CartInterface = CartItem;