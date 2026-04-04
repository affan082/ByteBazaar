import axios from "axios";
import config from "../config/global-info.json";

const API_BASE = config.server.uri;

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const cartService = {
  async getCart(): Promise<any> {
    try {
      const response = await apiClient.get('cart');          
      if (response.data && typeof response.data === 'object') {     
        if ('cart' in response.data && Array.isArray(response.data.cart)) {     
          return response.data.cart; 
        }   
        else if (Array.isArray(response.data)) {
          return response.data;
        }
        else {
          return [];
        }
      }  
      return [];      
    } catch (error: any) {
      console.error('Get cart error:', error);
      return [];
    }
  },

  async addToCart(productId: string, quantity: number = 1): Promise<any> {
    try {
      const response = await apiClient.post('cart/add', {
        productId,
        quantity
      });     
      if (response.data && response.data.cart && Array.isArray(response.data.cart)) {
        return response.data.cart;
      }     
      return [];   
    } catch (error: any) {
      console.error('Add to cart error:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Please login to add items to cart');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to add to cart');
    }
  },

  async updateCartItem(productId: string, quantity: number): Promise<any> {
    try {
      const response = await apiClient.put('cart/update', {
        productId,
        quantity
      });     
      if (response.data && response.data.cart && Array.isArray(response.data.cart)) {
        return response.data.cart;
      }    
      return [];   
    } catch (error: any) {
      console.error('Update cart error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update cart');
    }
  },

  async removeFromCart(productId: string): Promise<any> {
    try {
      const response = await apiClient.delete(`cart/remove/${productId}`);
      if (response.data && response.data.cart && Array.isArray(response.data.cart)) {
        return response.data.cart;     
      }
      return [];   
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from cart');
    }
  },

  async clearCart(): Promise<any> {
    try {
      const response = await apiClient.delete('cart/clear');
      return response.data.cart || [];
    } catch (error: any) {
      console.error('Clear cart error:', error);
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  }
};

export default cartService;