import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Button } from './ui/button';
import type { Table } from '@/types';




interface OrderTableButtonProps {
    table: Table;
}

const  OrderTableButtonList: React.FC<OrderTableButtonProps> = ({ table }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { hasRole, isAuthenticated } = useAuth();

    const isPelayan = hasRole('Pelayan');
    const isAvailable = table.status === 'available';
    const isDisabled = !isAuthenticated || !isPelayan || !isAvailable || loading;

    const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    
    if (isDisabled) return;

    setLoading(true);

    try {
      // POST request untuk create order
      const response = await api.post('/api/orders', {
        table_id: table.id
      });

      if (response.success || response.data || response.order) {
        // Navigate ke halaman order detail
        navigate(`/orders/${table.id}`);
      } else {
        alert('Gagal membuat order. Silakan coba lagi.');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(error.message || 'Terjadi kesalahan saat membuat order');
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
    </>
  );
};

export default OrderTableButtonList;