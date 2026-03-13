// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import cartService from "../services/cartService.ts";
// import { CartState, CartApiResponse } from "../interfaces/CartInterface.ts";

// interface CartContextType extends CartState {
//   addToCart: (productId: string, quantity?: number) => Promise<void>;
//   updateCartItem: (productId: string, quantity: number) => Promise<void>;
//   removeFromCart: (productId: string) => Promise<void>;
//   clearCart: () => Promise<void>;
//   refreshCart: () => Promise<void>;
//   isLoading: boolean;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [cartState, setCartState] = useState<CartState>({
//     items: [],
//     summary: {
//       totalItems: 0,
//       totalPrice: 0,
//       cartCount: 0,
//     },
//     loading: false,
//     error: null,
//   });

//   // Load cart from backend
//   const loadCart = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setCartState((prev) => ({
//         ...prev,
//         items: [],
//         summary: { totalItems: 0, totalPrice: 0, cartCount: 0 },
//         loading: false,
//       }));
//       return;
//     }

//     setCartState((prev) => ({ ...prev, loading: true, error: null }));

//     try {
//       const response: CartApiResponse = await cartService.getCart();

//       if (response.success) {
//         setCartState({
//           items: response.cart || [],
//           summary: response.summary || {
//             totalItems: 0,
//             totalPrice: 0,
//             cartCount: 0,
//           },
//           loading: false,
//           error: null,
//         });
//       } else {
//         setCartState({
//           items: [],
//           summary: { totalItems: 0, totalPrice: 0, cartCount: 0 },
//           loading: false,
//           error: response.message || "Failed to load cart",
//         });
//       }
//     } catch (error: any) {
//       setCartState((prev) => ({
//         ...prev,
//         loading: false,
//         error: error.message || "Failed to load cart",
//       }));
//     }
//   }, []);

//   // Load cart on initial render
//   useEffect(() => {
//     loadCart();
//   }, [loadCart]);

//   // Add to cart
//   const addToCart = async (productId: string, quantity: number = 1) => {
//     const token = localStorage.getItem("token");
//     console.log("Adding to cart for token:", token);
//     if (!token) {
//       throw new Error("Please login to add items to cart");
//     }

//     setCartState((prev) => ({ ...prev, loading: true }));

//     try {
//       const response: CartApiResponse = await cartService.addToCart(
//         productId,
//         quantity
//       );

//       if (response.success) {
//         setCartState({
//           items: response.cart || [],
//           summary: response.summary || cartState.summary,
//           loading: false,
//           error: null,
//         });
//       } else {
//         throw new Error(response.message || "Failed to add to cart");
//       }
//     } catch (error: any) {
//       setCartState((prev) => ({
//         ...prev,
//         loading: false,
//         error: error.message || "Failed to add to cart",
//       }));
//       throw error;
//     }
//   };

//   // Update cart item
//   const updateCartItem = async (productId: string, quantity: number) => {
//     setCartState((prev) => ({ ...prev, loading: true }));

//     try {
//       const response: CartApiResponse = await cartService.updateCartItem(
//         productId,
//         quantity
//       );

//       if (response.success) {
//         setCartState({
//           items: response.cart || [],
//           summary: response.summary || cartState.summary,
//           loading: false,
//           error: null,
//         });
//       } else {
//         throw new Error(response.message || "Failed to update cart");
//       }
//     } catch (error: any) {
//       setCartState((prev) => ({
//         ...prev,
//         loading: false,
//         error: error.message || "Failed to update cart",
//       }));
//       throw error;
//     }
//   };

//   // Remove from cart
//   const removeFromCart = async (productId: string) => {
//     setCartState((prev) => ({ ...prev, loading: true }));

//     try {
//       const response: CartApiResponse =
//         await cartService.removeFromCart(productId);

//       if (response.success) {
//         setCartState({
//           items: response.cart || [],
//           summary: response.summary || cartState.summary,
//           loading: false,
//           error: null,
//         });
//       } else {
//         throw new Error(response.message || "Failed to remove from cart");
//       }
//     } catch (error: any) {
//       setCartState((prev) => ({
//         ...prev,
//         loading: false,
//         error: error.message || "Failed to remove from cart",
//       }));
//       throw error;
//     }
//   };

//   // Clear cart
//   const clearCart = async () => {
//     setCartState((prev) => ({ ...prev, loading: true }));

//     try {
//       const response: CartApiResponse = await cartService.clearCart();

//       if (response.success) {
//         setCartState({
//           items: [],
//           summary: { totalItems: 0, totalPrice: 0, cartCount: 0 },
//           loading: false,
//           error: null,
//         });
//       } else {
//         throw new Error(response.message || "Failed to clear cart");
//       }
//     } catch (error: any) {
//       setCartState((prev) => ({
//         ...prev,
//         loading: false,
//         error: error.message || "Failed to clear cart",
//       }));
//       throw error;
//     }
//   };

//   // Refresh cart
//   const refreshCart = async () => {
//     await loadCart();
//   };

//   const value: CartContextType = {
//     ...cartState,
//     addToCart,
//     updateCartItem,
//     removeFromCart,
//     clearCart,
//     refreshCart,
//     isLoading: cartState.loading,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };
