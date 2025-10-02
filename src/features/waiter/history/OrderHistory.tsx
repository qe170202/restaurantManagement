import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Typography, 
  List, 
  Tag, 
  Button, 
  Space, 
  Empty,
  Input,
  DatePicker,
  Card
} from 'antd';
import { 
  CloseOutlined, 
  SearchOutlined, 
  CalendarOutlined,
  ShopOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import orderHistoryService from '../../../services/orderHistoryService';
import type { Order } from '../../../types/tableManagement';

const { Title, Text } = Typography;
const { Search } = Input;

interface OrderHistoryProps {
  visible: boolean;
  onClose: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ visible, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    if (visible) {
      loadOrderHistory();
      loadStatistics();
    }
  }, [visible]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, selectedDate]);

  const loadOrderHistory = () => {
    const history = orderHistoryService.getOrderHistory();
    setOrders(history);
  };

  const loadStatistics = () => {
    const statistics = orderHistoryService.getStatistics();
    setStats(statistics);
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

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'saved': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'saved': return 'Đã lưu';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
  };

  const clearHistory = () => {
    orderHistoryService.clearHistory();
    loadOrderHistory();
    loadStatistics();
  };

  return (
    <Drawer
      title={null}
      placement="right"
      closable={false}
      onClose={onClose}
      open={visible}
      width={480}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fafafa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={4} style={{ margin: 0 }}>
              <ShopOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              Lịch sử đơn hàng
            </Title>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={onClose}
              style={{ color: '#666' }}
            />
          </div>

          {/* Statistics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ color: '#1890ff', fontSize: '20px', fontWeight: 'bold' }}>{stats.totalOrders}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>Tổng đơn hàng</div>
            </Card>
            <Card size="small" style={{ textAlign: 'center' }}>
              <div style={{ color: '#52c41a', fontSize: '20px', fontWeight: 'bold' }}>{stats.todayOrders}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>Đơn hôm nay</div>
            </Card>
          </div>

          {/* Search and Filter */}
          <Space direction="vertical" style={{ width: '100%' }}>
            <Search
              placeholder="Tìm theo bàn, nhân viên, mã đơn..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
            <DatePicker
              placeholder="Lọc theo ngày"
              style={{ width: '100%' }}
              value={selectedDate}
              onChange={setSelectedDate}
              format="DD/MM/YYYY"
              suffixIcon={<CalendarOutlined />}
              allowClear
            />
          </Space>
        </div>

        {/* Orders List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {filteredOrders.length === 0 ? (
            <Empty 
              description="Không có đơn hàng nào"
              style={{ marginTop: '50px' }}
            />
          ) : (
            <List
              dataSource={filteredOrders}
              renderItem={(order) => (
                <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <Text strong style={{ fontSize: '16px' }}>#{order.id.slice(-6)}</Text>
                        <Tag color={getStatusColor(order.status)} style={{ marginLeft: '8px' }}>
                          {getStatusText(order.status)}
                        </Tag>
                      </div>
                      <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </Text>
                    </div>
                    
                    <div style={{ marginBottom: '8px' }}>
                      <Space size="large">
                        <div>
                          <ShopOutlined style={{ color: '#666', marginRight: '4px' }} />
                          <Text>{order.tableName}</Text>
                        </div>
                        <div>
                          <UserOutlined style={{ color: '#666', marginRight: '4px' }} />
                          <Text>{order.waiterName}</Text>
                        </div>
                      </Space>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatDateTime(order.createdAt)}
                      </Text>
                      {order.savedAt && (
                        <Text type="secondary" style={{ fontSize: '12px', marginLeft: '12px' }}>
                          Lưu: {formatDateTime(order.savedAt)}
                        </Text>
                      )}
                    </div>

                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {order.items.length} món: {order.items.map(item => `${item.dishName} (${item.quantity})`).join(', ')}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>

        {/* Footer */}
        {orders.length > 0 && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid #f0f0f0',
            background: '#fafafa'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
                </Text>
              </div>
              <Button 
                danger 
                size="small" 
                onClick={clearHistory}
                style={{ fontSize: '12px' }}
              >
                Xóa lịch sử
              </Button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default OrderHistory;
