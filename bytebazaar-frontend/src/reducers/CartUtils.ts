import axios from "axios";
import config from "../config/global-info.json";
import ProductInterface from "../interfaces/ProductInterface.tsx";
import { CartInterface } from "../interfaces/CartInterface.ts";

// Helper function to check if user is authenticated
function isAuthenticated(): boolean {
  return !!localStorage.getItem('token'); // Or your auth token storage method
}

// Fallback to localStorage only when not authenticated
function getLocalCart(): CartInterface[] {
  const cartString = localStorage.getItem("cart");
  return cartString ? JSON.parse(cartString) : [];
}

function saveLocalCart(cart: CartInterface[]): void {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export async function GetCurrentCart(): Promise<CartInterface[]> {
  if (isAuthenticated()) {
    try {
      const response = await axios.get(config.server.uri + "cart", {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.cart || [];
    } catch (error) {
      console.error("Failed to fetch cart from server:", error);
      return getLocalCart(); // Fallback to localStorage
    }
  }
  return getLocalCart();
}

export async function AddToCurrentCart(newItem: ProductInterface, quantity: number = 1): Promise<CartInterface[]> {
  if (isAuthenticated()) {
    try {
      const response = await axios.post(
        config.server.uri + "cart/add",
        { productId: newItem._id, quantity },
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data.cart;
    } catch (error) {
      console.error("Failed to add to cart on server:", error);
      // Fallback to localStorage
    }
  }
  
  // LocalStorage fallback
  let currentCart = getLocalCart();
  const existingItemIndex = currentCart.findIndex(
    item => item.product?._id === newItem._id
  );

  if (existingItemIndex > -1) {
    currentCart[existingItemIndex].quantity += quantity;
  } else {
    currentCart.push({
      product: newItem,
      quantity: quantity
    });
  }

  saveLocalCart(currentCart);
  return currentCart;
}

export async function UpdateCart(cart: CartInterface[]): Promise<boolean> {
  if (isAuthenticated()) {
    try {
      // Convert to server format
      const dbCart = cart.map(item => ({
        productId: item.product?._id,
        quantity: item.quantity
      }));

      const response = await axios.put(
        config.server.uri + "cart/update",
        { cart: dbCart },
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return true;
    } catch (error) {
      console.error("Failed to update cart on server:", error);
      // Fallback to localStorage
    }
  }
  
  saveLocalCart(cart);
  return true;
}

export async function DeleteFromCart(itemToDelete: CartInterface): Promise<CartInterface[]> {
  if (isAuthenticated() && itemToDelete.product?._id) {
    try {
      const response = await axios.delete(
        config.server.uri + `cart/remove/${itemToDelete.product._id}`,
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data.cart;
    } catch (error) {
      console.error("Failed to delete from cart on server:", error);
      // Fallback to localStorage
    }
  }
  
  // LocalStorage fallback
  let currentCart = getLocalCart();
  currentCart = currentCart.filter(
    item => item.product?._id !== itemToDelete.product?._id
  );
  
  saveLocalCart(currentCart);
  return currentCart;
}

export async function EmptyCart(): Promise<void> {
  if (isAuthenticated()) {
    try {
      await axios.delete(config.server.uri + "cart/clear", {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error("Failed to clear cart on server:", error);
      // Fallback to localStorage
    }
  }
  
  saveLocalCart([]);
}

