import React, { useState } from 'react';
import { Typography, Button, Avatar, Modal, notification } from 'antd';
import { MinusOutlined, PlusOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Dish, Order } from '../../../types/tableManagement';
import PaymentButton from '../payment/PaymentButton';
import { useOrder } from '../../../contexts/OrderContext';

const { Title, Text } = Typography;

interface OrderPanelProps {
  hasTable: boolean;
  tableName?: string;
  tableFloor?: number;
  order?: Order;
  dishes?: Dish[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onSaveOrder?: () => void;
  onCancelOrder?: () => void;
  onPrintBill?: () => void;
  isHistoryView?: boolean; // New prop to indicate if viewing from history
  onPaymentComplete?: (tableId: string) => void;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ 
  hasTable, 
  tableName, 
  tableFloor = 1,
  order,
  dishes = [],
  onUpdateQuantity,
  onSaveOrder,
  onCancelOrder,
  onPrintBill,
  isHistoryView = false,
  onPaymentComplete
}) => {
  const ctx = useOrder();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Handle save order with confirmation
  const handleSaveOrder = () => {
    setShowSaveModal(true);
  };

  // Handle cancel order with confirmation
  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  // Handle print bill with confirmation
  const handlePrintBill = () => {
    setShowPrintModal(true);
  };

  if (!hasTable) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Title level={4} style={{ marginBottom: 8 }}>Đơn hàng</Title>
        <Text type="secondary">Vui lòng chọn bàn để bắt đầu tạo đơn hàng</Text>
        <div style={{ width: '100%', height: '1px', background: '#eee', marginTop: 24 }} />
      </div>
    );
  }

  if (!order || order.items.length === 0) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Title level={4} style={{ marginBottom: 8 }}>Đơn hàng cho bàn {tableName}</Title>
        <Text type="secondary">Chưa có món ăn nào được chọn</Text>
        <div style={{ width: '100%', height: '1px', background: '#eee', marginTop: 24 }} />
      </div>
    );
  }

  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('vi-VN');
  const timeString = currentDate.toLocaleTimeString('vi-VN');

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      borderRadius: '16px',
      overflow: 'hidden',
      // Ensure flex children can shrink and allow inner scrolling area to work
      minHeight: 0,
      maxHeight: '100%'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #f0f0f0',
        textAlign: 'center'
      }}>
        <Title level={3} style={{ margin: 0, marginBottom: '16px' }}>Đơn hàng</Title>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Text strong>Ngày tạo đơn:</Text>
          <Text>{dateString}</Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Text strong>Thời điểm:</Text>
          <Text>{timeString}</Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Text strong>Khách hàng:</Text>
          <Text>{order.customerName || 'Lê Thị C'}</Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Text strong>Nhân viên:</Text>
          <Text>{order.waiterName}</Text>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text strong>Bàn:</Text>
          <div style={{
            background: '#1890ff',
            color: 'white',
            padding: '2px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {tableName} Tầng {tableFloor}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div style={{
        flex: '1 1 0%',
        minHeight: 0,
        padding: '16px',
        overflowY: 'auto',
        // Improve scroll behavior across browsers/devices
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin'
      }}>
        {(order?.items || ctx.currentOrder?.items || []).map((item) => {
          // Get current dish price from dishes array
          const currentDish = (dishes.length ? dishes : ctx.dishes).find(d => d.id === item.dishId);
          const currentPrice = currentDish ? currentDish.price : item.price;

  return (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              padding: '12px',
              border: '1px solid #f0f0f0',
              borderRadius: '8px'
            }}>
              <Avatar 
                src={`https://picsum.photos/60/60?random=${item.dishId}`}
                size={60}
                style={{ flexShrink: 0 }}
              />
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <Text strong style={{ marginBottom: 0 }}>
                      {item.dishName}
                    </Text>
                    <Text style={{ color: '#ff9500', fontWeight: 'bold' }}>
                      {currentPrice.toLocaleString('vi-VN')}đ
                    </Text>
                  </div>
                  <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                    {(currentPrice * item.quantity).toLocaleString('vi-VN')}đ
                  </Text>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '8px'
                }}>
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => (onUpdateQuantity ?? ctx.updateItemQuantity)?.(item.id, Math.max(0, item.quantity - 1))}
                    style={{
                      background: '#1890ff',
                      borderColor: '#1890ff',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  
                  <Text strong style={{ minWidth: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </Text>
                  
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => (onUpdateQuantity ?? ctx.updateItemQuantity)?.(item.id, item.quantity + 1)}
                    style={{
                      background: '#1890ff',
                      borderColor: '#1890ff',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #f0f0f0',
        background: '#fff',
        // Prevent footer from shrinking in flex layout
        flexShrink: 0
      }}>
        {/* Totals */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Text strong style={{ fontSize: '16px' }}>Tạm tính:</Text>
            <Text strong style={{ color: '#1890ff' }}>
              {order?.totalAmount.toLocaleString('vi-VN')}đ
            </Text>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ fontSize: '16px' }}>Giảm giá:</Text>
              <Text style={{ 
                background: '#f0f0f0', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontSize: '10px',
                color: '#666'
              }}>
                XVYZ6H
              </Text>
            </div>
            <Text strong style={{ color: '#ff4d4f' }}>
              -{(order?.discountAmount || 30000).toLocaleString('vi-VN')}đ
            </Text>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Text strong style={{ fontSize: '16px' }}>Tổng:</Text>
            <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
              {((order?.totalAmount || 0) - (order?.discountAmount || 30000)).toLocaleString('vi-VN')}đ
            </Text>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text strong style={{ fontSize: '16px' }}>Phương thức thanh toán:</Text>
            <Text>{order?.paymentMethod || 'chưa có'}</Text>
          </div>
        </div>

        {/* Payment Status and Action Buttons */}
        {isHistoryView ? (
          // For history view, show status and print button in same row
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            borderTop: '1px solid #f0f0f0',
            gap: '16px'
          }}>
            <Text style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: '#FF6F68',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {order.status && ['paid', 'completed'].includes(order.status) ? 
                <>✅ Thanh Toán Thành Công!</> : 
                <>⏳ Chưa Thanh Toán</>
              }
            </Text>
            <Button 
              type="primary"
              style={{ 
                background: '#141A93',
                borderColor: '#141A93',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                color: 'white',
                minWidth: '120px',
                height: '40px'
              }}
              onClick={handlePrintBill}
            >
              Xuất hóa đơn
            </Button>
          </div>
        ) : (
          <>
            {/* Action Buttons for normal view - No payment status shown */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderTop: '1px solid #f0f0f0'
            }}>
              {order.status && ['paid', 'completed'].includes(order.status) ? (
                // Only show print bill button for paid orders
                <Button 
                  type="primary"
                  style={{ 
                    width: '160px',
                    height: '40px',
                    background: '#52c41a',
                    borderColor: '#52c41a',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                  onClick={handlePrintBill}
                >
                  Xuất hóa đơn
                </Button>
              ) : (
                // Show all buttons for unpaid orders
                <>
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <Button 
                      style={{ 
                        width: '160px',
                        height: '40px',
                        borderRadius: '8px',
                        border: '1px solid #5296E5',
                        color: '#5296E5',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      onClick={handleSaveOrder}
                    >
                      Lưu
                    </Button>
                    <Button 
                      style={{ 
                        width: '160px',
                        height: '40px',
                        borderRadius: '8px',
                        border: '1px solid #5296E5',
                        color: '#5296E5',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      onClick={handleCancelOrder}
                    >
                      Hủy
                    </Button>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <Button 
                      type="primary"
                      style={{ 
                        width: '160px',
                        height: '40px',
                        background: '#52c41a',
                        borderColor: '#52c41a',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                      onClick={handlePrintBill}
                    >
                      Xuất hóa đơn
                    </Button>
                    <PaymentButton
                      order={order}
                      onPaymentComplete={onPaymentComplete}
                      style={{ 
                        width: '160px',
                        height: '40px',
                        background: '#ff4d4f',
                        borderColor: '#ff4d4f',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      Thanh toán
                    </PaymentButton>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Save Order Modal */}
      <Modal
        title="Xác nhận lưu đơn hàng"
        open={showSaveModal}
        onOk={() => {
          if (onSaveOrder) {
            onSaveOrder();
            notification.success({
              message: 'Lưu đơn hàng thành công',
              description: `Đơn hàng bàn ${tableName} đã được lưu vào lịch sử`,
              icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
              placement: 'topRight',
              duration: 3,
            });
          }
          setShowSaveModal(false);
        }}
        onCancel={() => setShowSaveModal(false)}
        okText="Xác nhận lưu"
        cancelText="Hủy"
        okType="primary"
        centered
        maskClosable={false}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '22px' }} />
          <span>
            Bạn có muốn lưu đơn hàng bàn {tableName} vào lịch sử không?
          </span>
        </div>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        title="Xác nhận hủy đơn hàng"
        open={showCancelModal}
        onOk={() => {
          if (onCancelOrder) {
            onCancelOrder();
            notification.info({
              message: 'Đã hủy đơn hàng',
              description: `Đơn hàng bàn ${tableName} đã được hủy`,
              placement: 'topRight',
              duration: 2,
            });
          }
          setShowCancelModal(false);
        }}
        onCancel={() => setShowCancelModal(false)}
        okText="Xác nhận hủy"
        cancelText="Không hủy"
        okType="danger"
        centered
        maskClosable={false}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '22px' }} />
          <span>
            Bạn có chắc chắn muốn hủy đơn hàng bàn {tableName}? Tất cả món ăn đã chọn sẽ bị xóa.
          </span>
        </div>
      </Modal>

      {/* Print Bill Modal */}
      <Modal
        title="Xuất hóa đơn"
        open={showPrintModal}
        onOk={() => {
          if (onPrintBill) {
            onPrintBill();
            notification.success({
              message: 'Đang xuất hóa đơn',
              description: `Hóa đơn bàn ${tableName} đang được tạo`,
              placement: 'topRight',
              duration: 3,
            });
          }
          setShowPrintModal(false);
        }}
        onCancel={() => setShowPrintModal(false)}
        okText="Xuất hóa đơn"
        cancelText="Hủy"
        centered
        maskClosable={false}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '22px' }} />
          <span>
            Bạn có muốn xuất hóa đơn cho bàn {tableName}?
          </span>
        </div>
      </Modal>

    </div>
  );
};

export default OrderPanel;

