import axios from "axios";
import config from "../config/global-info.json";
import ProductInterface from "../interfaces/ProductInterface.tsx";
import { WishlistInterface } from "../interfaces/WishlistInterface";

function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

function getLocalWishlist(): WishlistInterface[] {
  const wishlistString = localStorage.getItem("wishlist");
  return wishlistString ? JSON.parse(wishlistString) : [];
}

function saveLocalWishlist(wishlist: WishlistInterface[]): void {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

export async function GetCurrentWishlist(): Promise<WishlistInterface[]> {
  if (isAuthenticated()) {
    try {
       const response = await axios.get(config.server.uri + "wishlist", {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data.wishlist || [];
    } catch (error) {
      console.error("Failed to fetch wishlist from server:", error);
      return getLocalWishlist();
     }
  }
return getLocalWishlist();
}


export async function ToggleWishlistItem(product: ProductInterface): Promise<WishlistInterface[]> {
    if (isAuthenticated()) {
        try {
            const response = await axios.post(config.server.uri + "wishlist/toggle", {
                productId: product._id    }, 
                {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.wishlist;
        } catch (error) {
            console.error("Failed to toggle wishlist item:", error);
            return getLocalWishlist();
        }
    }
    let currentWishlist = getLocalWishlist();
    const itemIndex = currentWishlist.findIndex(item => item.product?._id === product._id);
    if (itemIndex > -1) {
    } else {
        currentWishlist.push({ product });
    }
    saveLocalWishlist(currentWishlist);
    return currentWishlist;
}


export async function IsInWishlist(product: ProductInterface): Promise<boolean> {
  if (isAuthenticated()) {
    try {
      const response = await axios.get(
        config.server.uri + "wishlist",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const wishlist: WishlistInterface[] = response.data.wishlist || [];
      return wishlist.some(item => item.product?._id === product._id);

    } catch (error) {
      console.error("Failed to check wishlist (server):", error);
      const localWishlist = getLocalWishlist();
      return localWishlist.some(item => item.product?._id === product._id);
    }
  }

  const localWishlist = getLocalWishlist();
  return localWishlist.some(item => item.product?._id === product._id);
}


export async function EmptyWishlist(): Promise<void> {
    if (isAuthenticated()) {   
        try {
            await axios.delete(config.server.uri + "wishlist/clear", {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error("Failed to empty wishlist on server:", error);
        }   
    }
    saveLocalWishlist([]);
}
