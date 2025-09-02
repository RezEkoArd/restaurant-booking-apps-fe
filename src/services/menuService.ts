import type { Menu, Order, OrderItem,  } from '@/types';
import { api } from './api';

export const menuService = {
    getMenus: async () : Promise<Menu[]> => {
        try {
            const response = await api.get('/api/menus');
           // Handle berbagai format response
            // Handle response format Laravel pagination
            if (response.success && response.data && response.data.data) {
                return response.data.data;
            } 
            // Handle jika tanpa pagination
            else if (response.success && response.data && Array.isArray(response.data)) {
                return response.data;
            }
            // Handle format lainnya
            else if (Array.isArray(response)) {
                return response;
            } 
            else if (response.data && Array.isArray(response.data)) {
                return response.data;
            } 
            else if (response.menus && Array.isArray(response.menus)) {
                return response.menus;
            } 
            else {
                console.warn('Unexpected response format:', response);
                return [];
            }
            } catch (error) {
            console.error('Error fetching menus:', error);
            throw error;
            }
    },

    createOrder: async (tableId: number, items: OrderItem[]): Promise<Order> => {
        try {
        const response = await api.post('/api/orders', {
            table_id: tableId,
            items: items.map(item => ({
            menu_id: item.menu_id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
            }))
        });
        
        return response.data || response.order || response;
        } catch (error) {
        console.error('Error creating order:', error);
        throw error;
        }
    }
}