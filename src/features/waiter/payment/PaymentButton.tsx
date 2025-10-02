import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Typography, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import type { Order } from '../../../types/tableManagement';
import orderHistoryService from '../../../services/orderHistoryService';

const { Text } = Typography;
const { Option } = Select;

interface PaymentButtonProps {
  order?: Order;
  style?: React.CSSProperties;
  disabled?: boolean;
  children?: React.ReactNode;
  onPaymentComplete?: (tableId: string) => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  order, 
  style, 
  disabled = false,
  children = 'Thanh toán',
  onPaymentComplete
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');

  const handlePayment = () => {
    if (order && order.items.length > 0) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentConfirm = () => {
    if (!order) return;
    
    // Nếu chọn chuyển khoản, hiển thị modal QR
    if (paymentMethod === 'transfer') {
      setShowPaymentModal(false);
      setShowQRModal(true);
      return;
    }
    
    // Xử lý thanh toán tiền mặt
    completePayment();
  };

  const completePayment = () => {
    if (!order) return;
    
    try {
      // Cập nhật trạng thái order thành 'paid'
      const paidOrder = {
        ...order,
        status: 'paid' as 'paid',
        paymentMethod: paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản',
        updatedAt: new Date().toISOString()
      };
      
      // Lưu order đã thanh toán vào localStorage
      orderHistoryService.saveOrder(paidOrder);
      
      setShowPaymentModal(false);
      setShowQRModal(false);
      setShowSuccessModal(true);
      
    } catch (error) {
      message.error('Lỗi khi xử lý thanh toán');
      console.error('Payment error:', error);
    }
  };

  // Auto close success modal after 3 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        
        // Gọi callback để cập nhật trạng thái bàn
        if (onPaymentComplete && order) {
          onPaymentComplete(order.tableId);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, onPaymentComplete, order]);

  const total = order ? (order.totalAmount || 0) - (order.discountAmount || 0) : 0;

  return (
    <>
      <Button
        type="primary"
        style={style}
        onClick={handlePayment}
        disabled={disabled || !order || order.items.length === 0}
      >
        {children}
      </Button>

      <Modal
        title="Thanh toán"
        open={showPaymentModal}
        onCancel={() => setShowPaymentModal(false)}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => setShowPaymentModal(false)}
            style={{ 
              border: '1px solid #1890ff',
              color: '#1890ff',
              marginRight: '8px'
            }}
          >
            Hủy
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={handlePaymentConfirm}
            style={{ 
              border: '1px solid #1890ff',
              background: '#1890ff'
            }}
          >
            Tiếp tục
          </Button>
        ]}
        centered
        maskClosable={false}
        width={400}
      >
        <div style={{ padding: '16px 0' }}>
          <Text style={{ display: 'block', marginBottom: '16px' }}>
            Vui lòng chọn phương thức thanh toán
          </Text>
          
          <Select
            value={paymentMethod}
            onChange={setPaymentMethod}
            style={{ width: '100%' }}
            size="large"
          >
            <Option value="cash">Tiền mặt</Option>
            <Option value="transfer">Chuyển khoản</Option>
          </Select>
        </div>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        title="Thanh toán"
        open={showQRModal}
        onCancel={() => {
          setShowQRModal(false);
          setShowPaymentModal(true); // Quay lại modal chọn phương thức
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setShowQRModal(false);
              setShowPaymentModal(true);
            }}
            style={{ 
              border: '1px solid #1890ff',
              color: '#1890ff',
              marginRight: '8px'
            }}
          >
            Hủy
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={completePayment}
            style={{ 
              border: '1px solid #1890ff',
              background: '#1890ff'
            }}
          >
            Tiếp tục
          </Button>
        ]}
        centered
        maskClosable={false}
        width={400}
      >
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <Select
            value="Đơn hàng của bạn"
            disabled
            style={{ width: '100%', marginBottom: '24px' }}
            size="large"
          />
          
          <Text style={{ 
            display: 'block', 
            marginBottom: '16px',
            color: '#666' 
          }}>
            Vui lòng quét mã để thanh toán:
          </Text>
          
          {/* QR Code Area */}
          <div style={{
            width: '200px',
            height: '200px',
            margin: '0 auto 24px',
            border: '2px dashed #d9d9d9',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5'
          }}>
            <Text style={{ color: '#999', fontSize: '14px' }}>
              Mã QR ở đây
            </Text>
          </div>
          
          <div style={{ 
            padding: '12px', 
            background: '#f5f5f5', 
            borderRadius: '6px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Tổng:</Text>
              <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                {total.toLocaleString('vi-VN')}đ
              </Text>
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        title="Thanh toán"
        open={showSuccessModal}
        footer={[
          <Button 
            key="close" 
            type="primary" 
            onClick={() => {
              setShowSuccessModal(false);
              if (onPaymentComplete && order) {
                onPaymentComplete(order.tableId);
              }
            }}
            style={{ 
              background: '#1890ff',
              borderColor: '#1890ff'
            }}
          >
            Thoát
          </Button>
        ]}
        centered
        maskClosable={false}
        width={400}
        closable={false}
      >
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <Select
            value="Đơn hàng của bạn"
            disabled
            style={{ width: '100%', marginBottom: '32px' }}
            size="large"
          />
          
          <Text style={{ 
            display: 'block', 
            marginBottom: '24px',
            color: '#52c41a',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Thanh toán thành công!
          </Text>
          
          {/* Animated Success Icon */}
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 24px',
            position: 'relative'
          }}>
            {/* Spinning Circle */}
            <div 
              className="success-circle-animation"
              style={{
                width: '120px',
                height: '120px',
                border: '6px solid #52c41a',
                borderRadius: '50%',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Check Icon */}
              <CheckOutlined 
                className="success-check-animation"
                style={{ 
                  fontSize: '48px', 
                  color: '#52c41a'
                }} 
              />
            </div>
          </div>
          
          <div style={{ 
            padding: '12px', 
            background: '#f5f5f5', 
            borderRadius: '6px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Tổng:</Text>
              <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                {total.toLocaleString('vi-VN')}đ
              </Text>
            </div>
          </div>
        </div>

        {/* CSS Animation Styles */}
        <style>{`
          .success-circle-animation {
            animation: successSpin 1s ease-in-out;
          }
          
          .success-check-animation {
            animation: successFadeIn 1s ease-in-out 0.5s both;
          }
          
          @keyframes successSpin {
            from {
              transform: rotate(0deg);
              opacity: 0;
            }
            to {
              transform: rotate(360deg);
              opacity: 1;
            }
          }
          
          @keyframes successFadeIn {
            from {
              opacity: 0;
              transform: scale(0.5);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </Modal>
    </>
  );
};

export default PaymentButton;