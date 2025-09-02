import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Button } from './ui/button';
import type { Table } from '@/types';




interface OrderTableButtonProps {
    table: Table;
}

const  OrderTableButton: React.FC<OrderTableButtonProps> = ({ table }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { hasRole, isAuthenticated } = useAuth();

    const isPelayan = hasRole('Pelayan');
    const isAvailable = table.status === 'available';
    const isDisabled = !isAuthenticated || !isPelayan || !isAvailable || loading;

    const bgColor = isAvailable ? 'bg-green-500' : 'bg-gray-400';

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
    <div className="relative">
      <Button 
            onClick={handleClick}
            className={`w-full px-2 py-15 rounded-lg ${bgColor} text-white font-semibold transition hover:opacity-80 cursor-pointer ${
            isDisabled ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer'
            } block text-center`}
        >
            {loading ? (
            <span>Loading...</span>
            ) : (
            <span>{table.table_no}</span>
            )}
        </Button>
            {/* Tooltip info untuk user bukan pelayan */}
                {/* {isAuthenticated && !isPelayan && (
                    <div className="absolute top-full left-0 mt-1 text-xs text-gray-600 w-full text-center">
                    Hanya pelayan yang bisa membuat order
                    </div>
                )} */}

                {/* Tooltip info untuk table tidak available */}
                {/* {!isAvailable && (
                    <div className="absolute top-full left-0 mt-1 text-xs text-gray-600 w-full text-center">
                    Meja tidak available
                    </div>
                )} */}
         </div>
  );
};

export default OrderTableButton;