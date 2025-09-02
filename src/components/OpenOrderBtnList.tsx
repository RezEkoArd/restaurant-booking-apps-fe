import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import type {  TableItem } from '@/types';
import { orderService } from '@/services/orderService';


interface OrderTableButtonProps {
    table: TableItem;
}

const  OrderTableButtonList: React.FC<OrderTableButtonProps> = ({ table }) => {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
    const navigate = useNavigate();
    const { hasRole, isAuthenticated } = useAuth();

    const isPelayan = hasRole('Pelayan');
    const isAvailable = table.status === 'available';
    const isDisabled = !isAuthenticated || !isPelayan || !isAvailable || loading;

    const handleClick = async () => {
      if (isDisabled) return;
      setLoading(true);

      try {
        // Open table (create new order)
        const response = await orderService.openTable(table.id);
        console.log('Open id table response:', response);
        
        if (response && response.id) {
          // Navigate ke detail order page dengan order ID
          navigate(`/orders/${response.id}`, { 
            state: { 
              tableNo: table.table_no,
              orderData: response 
            } 
          });
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error: any) {
        console.error('Error opening table:', error);
        setError(error.message || 'Gagal membuka meja. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <>
        <Button variant="outline" size="sm" className={`cursor-pointer ${
            isDisabled ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer'
            } block text-center` }
         onClick={handleClick}
        >
           {loading ? (
            <span>Loading...</span>
            ) : (
            <span>Open Order</span>
            )}
        </Button>
        {error && (
          <div className="absolute top-full left-0 mt-1 text-red-500 text-xs">
            {error}
          </div>
        )}
    </>
  );
};

export default OrderTableButtonList;