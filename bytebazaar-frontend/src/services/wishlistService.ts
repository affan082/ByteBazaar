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

const wishlistService = {
  async getWishlist(): Promise<any> {
    try {
      const response = await apiClient.get('wishlist');      
      if (response.data && typeof response.data === 'object') {
        if ('wishlist' in response.data && Array.isArray(response.data.wishlist)) {
          return response.data.wishlist;
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
      console.error('Get wishlist error:', error);
      return []; 
    }
  },

  async toggleWishlist(productId: string): Promise<any> {
    try {     
      const response = await apiClient.post('wishlist/toggle', {
        productId
      });
    if (response.data && response.data.wishlist && Array.isArray(response.data.wishlist)) {
        return {
          wishlist: response.data.wishlist,
          isInWishlist: response.data.isInWishlist || false
        };
      }      
      return { wishlist: [], isInWishlist: false };      
    } catch (error: any) {
      console.error('Toggle wishlist error:', error);      
      if (error.response?.status === 401) {
        throw new Error('Please login to manage wishlist');
      }      
      throw new Error(error.response?.data?.message || 'Failed to update wishlist');
    }
  },

  async removeFromWishlist(productId: string): Promise<any> {
    try {
      const response = await apiClient.delete(`wishlist/remove/${productId}`);
      if (response.data && response.data.wishlist && Array.isArray(response.data.wishlist)) {
        return response.data.wishlist;
      }
      return [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  },

  async clearWishlist(): Promise<any> {
    try {
      console.log('Clearing wishlist');
      const response = await apiClient.delete('wishlist/clear');      
      return response.data.wishlist || [];      
    } catch (error: any) {
      console.error('Clear wishlist error:', error);
      throw new Error(error.response?.data?.message || 'Failed to clear wishlist');
    }
  }
};

export default wishlistService;