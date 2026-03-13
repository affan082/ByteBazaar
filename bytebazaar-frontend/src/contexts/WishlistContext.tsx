// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import wishlistService from "../services/wishlistService.ts";
// import {
//   WishlistState,
//   WishlistApiResponse,
// } from "../interfaces/WishlistInterface.tsx";

// interface WishlistContextType extends WishlistState {
//   toggleWishlist: (productId: string) => Promise<boolean>;
//   clearWishlist: () => Promise<void>;
//   refreshWishlist: () => Promise<void>;
//   isInWishlist: (productId: string) => boolean;
//   isLoading: boolean;
// }

// const WishlistContext = createContext<WishlistContextType | undefined>(
//   undefined
// );

// export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [wishlistState, setWishlistState] = useState<WishlistState>({
//     items: [],
//     loading: false,
//     error: null,
//   });

//   // Load wishlist from backend
//   const loadWishlist = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setWishlistState((prev) => ({
//         ...prev,
//         items: [],
//         loading: false,
//       }));
//       return;
//     }

//     setWishlistState((prev) => ({ ...prev, loading: true, error: null }));

//     try {
//       const response: WishlistApiResponse = await wishlistService.getWishlist();

//       if (response.success) {
//         setWishlistState({
//           items: response.wishlist || [],
//           loading: false,
//           error: null,
//         });
//       } else {
//         setWishlistState({
//           items: [],
//           loading: false,
//           error: response.message || "Failed to load wishlist",
//         });
//       }
//     } catch (error: any) {
//       setWishlistState((prev) => ({
//         ...prev,
//         loading: false,
//         error: error.message || "Failed to load wishlist",
//       }));
//     }
//   }, []);

//   // Load wishlist on initial render
//   useEffect(() => {
//     loadWishlist();
//   }, [loadWishlist]);

//   // Toggle wishlist (add or remove)
//   const toggleWishlist = async (productId: string) => {
//     const token = localStorage.getItem("token");
//     console.log("Toggling wishlist for token:", token);
//     if (!token) {
//       throw new Error("Please login to manage wishlist");
//     }

//     setWishlistState((prev) => ({ ...prev, loading: true }));

//     try {
//       const response: WishlistApiResponse =
//         await wishlistService.toggleWishlist(productId);

//       if (response.success) {
//         setWishlistState({
//           items: response.wishlist || [],
//           loading: false,
//           error: null,
//         });
//         return response.isInWishlist || false;
//       } else {
//         throw new Error(response.message || "Failed to update wishlist");
//       }
//     } catch (error: any) {
//       setWishlistState((prev) => ({
//         ...prev,
//         loading: false,
//         error: error.message || "Failed to update wishlist",
//       }));
//       throw error;
//     }
//   };

//   // Clear wishlist
//   const clearWishlist = async () => {
//     setWishlistState((prev) => ({ ...prev, loading: true }));

//     try {
//       const response: WishlistApiResponse =
//         await wishlistService.clearWishlist();

//       if (response.success) {
//         setWishlistState({
//           items: [],
//           loading: false,
//           error: null,
//         });
//       } else {
//         throw new Error(response.message || "Failed to clear wishlist");
//       }
//     } catch (error: any) {
//       setWishlistState((prev) => ({
//         ...prev,
//         loading: false,
//         error: error.message || "Failed to clear wishlist",
//       }));
//       throw error;
//     }
//   };

//   // Refresh wishlist
//   const refreshWishlist = async () => {
//     await loadWishlist();
//   };

//   // Check if product is in wishlist
//   const isInWishlist = (productId: string): boolean => {
//     return wishlistState.items.some((item) => item.product._id === productId);
//   };

//   const value: WishlistContextType = {
//     ...wishlistState,
//     toggleWishlist,
//     clearWishlist,
//     refreshWishlist,
//     isInWishlist,
//     isLoading: wishlistState.loading,
//   };

//   return (
//     <WishlistContext.Provider value={value}>
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => {
//   const context = useContext(WishlistContext);
//   if (!context) {
//     throw new Error("useWishlist must be used within a WishlistProvider");
//   }
//   return context;
// };
