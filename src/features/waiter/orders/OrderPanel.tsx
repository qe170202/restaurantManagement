import React from 'react';
import { Typography, Button, Avatar, Modal, notification } from 'antd';
import { MinusOutlined, PlusOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Dish } from '../../../types/tableManagement';

const { Title, Text } = Typography;

interface OrderItem {
  id: string;
  dishId: string;
  dishName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  tableId: string;
  tableName: string;
  waiterId: string;
  waiterName: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  customerName?: string;
  discountAmount?: number;
  paymentMethod?: string;
}

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
  onPayment?: () => void;
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
  onPayment
}) => {
  // Handle save order with success notification
  const handleSaveOrder = () => {
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
  };

  // Handle cancel order with confirmation
  const handleCancelOrder = () => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: `Bạn có chắc chắn muốn hủy đơn hàng bàn ${tableName}? Tất cả món ăn đã chọn sẽ bị xóa.`,
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      okText: 'Xác nhận hủy',
      cancelText: 'Không hủy',
      okType: 'danger',
      centered: true,
      onOk() {
        if (onCancelOrder) {
          onCancelOrder();
          notification.info({
            message: 'Đã hủy đơn hàng',
            description: `Đơn hàng bàn ${tableName} đã được hủy`,
            placement: 'topRight',
            duration: 2,
          });
        }
      },
    });
  };

  // Handle print bill with confirmation
  const handlePrintBill = () => {
    Modal.confirm({
      title: 'Xuất hóa đơn',
      content: `Bạn có muốn xuất hóa đơn cho bàn ${tableName}?`,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      okText: 'Xuất hóa đơn',
      cancelText: 'Hủy',
      centered: true,
      onOk() {
        if (onPrintBill) {
          onPrintBill();
          notification.success({
            message: 'Đang xuất hóa đơn',
            description: `Hóa đơn bàn ${tableName} đang được tạo`,
            placement: 'topRight',
            duration: 3,
          });
        }
      },
    });
  };

  // Handle payment with confirmation
  const handlePayment = () => {
    Modal.confirm({
      title: 'Xác nhận thanh toán',
      content: `Xác nhận thanh toán cho bàn ${tableName} với tổng tiền ${((order?.totalAmount || 0) - (order?.discountAmount || 30000)).toLocaleString('vi-VN')}đ?`,
      icon: <CheckCircleOutlined style={{ color: '#ff4d4f' }} />,
      okText: 'Xác nhận thanh toán',
      cancelText: 'Hủy',
      okType: 'primary',
      centered: true,
      onOk() {
        if (onPayment) {
          onPayment();
          notification.success({
            message: 'Thanh toán thành công',
            description: `Đã thanh toán cho bàn ${tableName}`,
            placement: 'topRight',
            duration: 3,
          });
        }
      },
    });
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
      overflow: 'hidden'
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
        flex: 1,
        padding: '16px',
        overflowY: 'auto'
      }}>
        {order.items.map((item) => {
          // Get current dish price from dishes array
          const currentDish = dishes.find(d => d.id === item.dishId);
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>
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
                    onClick={() => onUpdateQuantity?.(item.id, Math.max(0, item.quantity - 1))}
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
                    onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
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
        background: '#fafafa'
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

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
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
            <Button 
              type="primary"
              style={{ 
                width: '160px',
                height: '40px',
                background: '#ff4d4f',
                borderColor: '#ff4d4f',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
              onClick={handlePayment}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;

 

