import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../../../types/tableManagement';

interface PaymentButtonProps {
  order?: Order;
  style?: React.CSSProperties;
  disabled?: boolean;
  children?: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  order, 
  style, 
  disabled = false,
  children = 'Thanh toán'
}) => {
  const navigate = useNavigate();

  const handlePayment = () => {
    if (order && order.items.length > 0) {
      navigate('/payment', { 
        state: { 
          order: order 
        } 
      });
    }
  };

  return (
    <Button
      type="primary"
      style={style}
      onClick={handlePayment}
      disabled={disabled || !order || order.items.length === 0}
    >
      {children}
    </Button>
  );
};

export default PaymentButton;
