import { api } from './api';
import { type Order,  } from '../types';

export const orderService = {
        openTable: async (tableId: number): Promise<Order> => {
        try {
        const response = await api.post('/api/orders', {
            table_id: tableId
        });
        
        return response.data || response;
        } catch (error) {
        console.error('Error opening table:', error);
        throw error;
        }
    },

      addOrderItems: async (orderId: number, items: any[]) => {
    try {
      const response = await api.post(`/api/orders/${orderId}/items`, {
        items: items
      });
      return response;
    } catch (error) {
      console.error('Error adding order items:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrder: async (orderId: number): Promise<Order> => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },
  
  getOrderItems: async (orderId: number): Promise<any[]> => {
    try {
      const response = await api.get(`/api/orders/${orderId}/items`);
      return response.data || response.items || [];
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  }

}