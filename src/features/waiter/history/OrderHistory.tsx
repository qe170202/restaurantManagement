import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Typography, 
  Button, 
  Empty,
  Input,
  DatePicker,
  TimePicker
} from 'antd';
import { 
  CloseOutlined, 
  SearchOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import orderHistoryService from '../../../services/orderHistoryService';
import type { Order } from '../../../types/tableManagement';
import { useOrder } from '../../../contexts/OrderContext';

const { Title, Text } = Typography;

interface OrderHistoryProps {
  visible: boolean;
  onClose: () => void;
  onSelectOrder?: (order: Order) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ visible, onClose, onSelectOrder }) => {
  const { applyHistoryOrder } = useOrder();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    if (visible) {
      loadOrderHistory();
    }
  }, [visible]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, selectedDate, startTime, endTime]);

  // Disable/enable body scroll when sidebar opens/closes
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventKeyboardScroll = (e: KeyboardEvent) => {
      const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // Space, Page Up/Down, Home, End, Arrow keys
      if (keys.includes(e.keyCode)) {
        e.preventDefault();
        return false;
      }
    };

    if (visible) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
      
      // Add event listeners to prevent scroll
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('keydown', preventKeyboardScroll, false);
    } else {
      // Enable body scroll
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Remove event listeners
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventKeyboardScroll);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventKeyboardScroll);
    };
  }, [visible]);

  const loadOrderHistory = () => {
    const history = orderHistoryService.getOrderHistory();
    setOrders(history);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.waiterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (selectedDate) {
      const selectedDateString = selectedDate.format('YYYY-MM-DD');
      filtered = filtered.filter(order => {
        const orderDate = dayjs(order.createdAt).format('YYYY-MM-DD');
        return orderDate === selectedDateString;
      });
    }

    // Filter by time range
    if (startTime && endTime) {
      filtered = filtered.filter(order => {
        const orderTime = dayjs(order.createdAt);
        const startDateTime = selectedDate ? 
          selectedDate.hour(startTime.hour()).minute(startTime.minute()) : 
          dayjs().hour(startTime.hour()).minute(startTime.minute());
        const endDateTime = selectedDate ? 
          selectedDate.hour(endTime.hour()).minute(endTime.minute()) : 
          dayjs().hour(endTime.hour()).minute(endTime.minute());
        
        return orderTime.isAfter(startDateTime) && orderTime.isBefore(endDateTime);
      });
    }

    setFilteredOrders(filtered);
  };



  if (!visible) return null;

  const sidebarContent = (
    <>
      {/* Custom scrollbar and TimePicker CSS */}
      <style>{`
        .order-history-scrollable::-webkit-scrollbar {
          width: 6px;
        }
        .order-history-scrollable::-webkit-scrollbar-track {
          background: transparent;
        }
        .order-history-scrollable::-webkit-scrollbar-thumb {
          background-color: #d9d9d9;
          border-radius: 3px;
        }
        .order-history-scrollable::-webkit-scrollbar-thumb:hover {
          background-color: #bfbfbf;
        }
        
        /* Custom DatePicker with Bold Text and No Border */
        .custom-date-picker-no-border.ant-picker {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
          padding: 0 !important;
          width: auto !important;
          min-width: 90px !important;
        }
        .custom-date-picker-no-border.ant-picker:hover {
          border: none !important;
          box-shadow: none !important;
        }
        .custom-date-picker-no-border.ant-picker:focus {
          border: none !important;
          box-shadow: none !important;
        }
        .custom-date-picker-no-border.ant-picker-focused {
          border: none !important;
          box-shadow: none !important;
        }
        .custom-date-picker-no-border .ant-picker-input {
          padding: 0 !important;
          width: auto !important;
        }
        .custom-date-picker-no-border .ant-picker-input input {
          font-weight: bold !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          width: auto !important;
          min-width: 90px !important;
        }
        .custom-date-picker-no-border .ant-picker-input input:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* TimePicker Orange */
        .time-picker-orange.ant-picker {
          background: #FF9500 !important;
          border: none !important;
          border-radius: 20px !important;
          text-align: center !important;
        }
        .time-picker-orange.ant-picker input {
          color: white !important;
          background: transparent !important;
          text-align: center !important;
          font-weight: 500 !important;
        }
        .time-picker-orange.ant-picker input::placeholder {
          color: rgba(255, 255, 255, 0.9) !important;
          text-align: center !important;
        }
        .time-picker-orange.ant-picker .ant-picker-suffix {
          display: none !important;
        }
        
        /* TimePicker Red */
        .time-picker-red.ant-picker {
          background: #FF4D4F !important;
          border: none !important;
          border-radius: 20px !important;
          text-align: center !important;
        }
        .time-picker-red.ant-picker input {
          color: white !important;
          background: transparent !important;
          text-align: center !important;
          font-weight: 500 !important;
        }
        .time-picker-red.ant-picker input::placeholder {
          color: rgba(255, 255, 255, 0.9) !important;
          text-align: center !important;
        }
        .time-picker-red.ant-picker .ant-picker-suffix {
          display: none !important;
        }
      `}</style>
      
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0, 0, 0, 0.45)',
          zIndex: 999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'auto', // Đảm bảo có thể click
          touchAction: 'none' // Ngăn touch scroll trên mobile
        }}
        onClick={onClose}
        onWheel={(e) => e.preventDefault()} // Ngăn wheel scroll
        onTouchMove={(e) => e.preventDefault()} // Ngăn touch scroll
      />
      
      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '0',
          width: '520px',
          height: 'calc(100vh - 80px)',
          background: '#fff',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden' // Ngăn sidebar scroll theo trang chính
        }}
      >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {/* Close button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={onClose}
              style={{ 
                color: '#8c8c8c',
                border: 'none',
                boxShadow: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '6px'
              }}
              size="small"
            />
          </div>

          {/* Title */}
          <Title level={4} style={{ 
            margin: '0 0 24px 0', 
            color: '#262626', 
            fontWeight: 600,
            fontSize: '18px'
          }}>
            Tìm kiếm đơn hàng
          </Title>

          {/* Search Input */}
          <div style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Tìm kiếm"
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '8px',
                border: '1px solid #0088FF87',
                padding: '8px 12px',
                fontSize: '14px'
              }}
              size="middle"
            />
          </div>

          {/* Date and Time Filter - Same Row */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Date Filter */}
            <div style={{ 
              width: 'auto',
              minWidth: '140px',
              maxWidth: '160px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              height: '40px',
              paddingLeft: '12px',
              paddingRight: '8px',
              background: 'white'
            }}>
              <CalendarOutlined style={{ 
                color: '#40a9ff', 
                fontSize: '16px',
                marginRight: '6px',
                flexShrink: 0
              }} />
              <DatePicker
                placeholder="19/08/2025"
                style={{ 
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  background: 'transparent',
                  width: 'auto',
                  minWidth: '90px',
                  fontWeight: 'bold'
                }}
                value={selectedDate}
                onChange={setSelectedDate}
                format="DD/MM/YYYY"
                suffixIcon={null}
                allowClear={false}
                size="middle"
                className="custom-date-picker-no-border"
              />
            </div>
            
            {/* Time Range - Right Aligned */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <TimePicker
                placeholder="17:09:22"
                style={{ 
                  width: '100px',
                  borderRadius: '20px',
                  background: '#FF9500',
                  border: 'none',
                  color: 'white',
                  height: '40px'
                }}
                value={startTime}
                onChange={setStartTime}
                format="HH:mm:ss"
                size="middle"
                className="time-picker-orange"
                suffixIcon={null}
              />
              <TimePicker
                placeholder="18:09:22"
                style={{ 
                  width: '100px',
                  borderRadius: '20px',
                  background: '#FF4D4F',
                  border: 'none',
                  color: 'white',
                  height: '40px'
                }}
                value={endTime}
                onChange={setEndTime}
                format="HH:mm:ss"
                size="middle"
                className="time-picker-red"
                suffixIcon={null}
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div 
          className="order-history-scrollable"
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            overflowX: 'hidden',
            padding: '0 24px 24px',
            background: '#fff',
            scrollbarWidth: 'thin', // Firefox
            scrollbarColor: '#d9d9d9 transparent' // Firefox
          }}
        >
          {filteredOrders.length === 0 ? (
            <Empty 
              description={
                <span style={{ color: '#8c8c8c', fontSize: '14px' }}>
                  Không có đơn hàng nào
                </span>
              }
              style={{ marginTop: '60px' }}
              imageStyle={{ height: '80px' }}
            />
          ) : (
            <div>
              {filteredOrders.map((order) => (
                 <div 
                   key={order.id}
                   style={{
                     background: '#fff',
                     border: '1px solid #000',
                     borderRadius: '12px',
                     padding: '16px',
                     marginBottom: '12px',
                     boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                     transition: 'all 0.2s ease',
                     cursor: 'pointer'
                   }}
                   onClick={() => {
                     if (onSelectOrder) {
                       onSelectOrder(order);
                     } else {
                       applyHistoryOrder(order);
                     }
                     onClose();
                   }}
                 >
                  {/* Header Row: Order ID + Table Badge + Date */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '8px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text strong style={{ 
                        fontSize: '16px', 
                        color: '#000',
                        fontWeight: 700
                      }}>
                        ORD{order.id.slice(-2)}
                      </Text>
                      <div style={{
                        background: '#1890ff',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        Bàn: {order.tableName.replace(/[^\d]/g, '')}
                      </div>
                    </div>
                    <Text style={{ 
                      fontSize: '14px', 
                      color: '#000',
                      fontWeight: 400
                    }}>
                      {dayjs(order.createdAt).format('DD/MM/YYYY')}
                    </Text>
                  </div>
                  
                  {/* Bottom Row: Time + Price */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <Text style={{ 
                      fontSize: '14px', 
                      color: '#000',
                      fontWeight: 400
                    }}>
                      {dayjs(order.createdAt).format('HH:mm:ss')}
                    </Text>
                    <div style={{ textAlign: 'right' }}>
                      <Text style={{ 
                        fontSize: '12px', 
                        color: '#666',
                        fontWeight: 400,
                        marginRight: '4px'
                      }}>
                        Giá: 
                      </Text>
                      <Text strong style={{ 
                        color: '#1890ff', 
                        fontSize: '16px',
                        fontWeight: 700
                      }}>
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(sidebarContent, document.body);
};

export default OrderHistory;
