import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Typography, message } from 'antd';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { 
  mockDishCategories, 
  mockDishes, 
  mockTablesFloor1, 
  getTableById
} from '../services/mockTableData';
import orderService from '../services/orderService';
import type { Dish, Table, Order } from '../types/tableManagement';
import MenuSection from '../features/waiter/menu/MenuSection';
import TableSelector from '../features/waiter/tables/TableSelector';
import OrderHeader from '../features/waiter/orders/OrderHeader';
import OrderPanel from '../features/waiter/orders/OrderPanel';

const { Content } = Layout;
const { Text } = Typography;

const WaiterPage: React.FC = () => {
  const { authState } = useAuth();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [dishes] = useState<Dish[]>(mockDishes);
  const [tables, setTables] = useState<Table[]>(mockTablesFloor1);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(timeString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Menu filtering is now handled inside MenuSection

  const handleTableSelect = (tableId: string) => {
    const table = getTableById(tableId);
    if (!table) return;
    const updatedTables = tables.map(t => ({
      ...t,
      status: t.id === tableId ? 'selected' as const : (t.status === 'selected' ? 'empty' as const : t.status)
    }));
    setTables(updatedTables);
    setSelectedTable(tableId);
    const existingOrder = orderService.getActiveOrderByTableId(tableId);
    if (existingOrder) {
      setCurrentOrder(existingOrder);
    } else {
      const newOrder = orderService.createOrderForTable({
        tableId,
        waiterId: authState.user?.id || '',
        waiterName: authState.user?.fullName || ''
      });
      setCurrentOrder(newOrder);
    }
  };

  const handleAddDishToOrder = (dish: Dish) => {
    if (!selectedTable || !currentOrder) {
      message.warning('Vui lòng chọn bàn trước khi thêm món');
      return;
    }
    const updatedOrder = orderService.addItem(currentOrder, dish);
    setCurrentOrder(updatedOrder);
    message.success(`Đã thêm ${dish.name} vào đơn hàng`);
  };

  

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]} style={{ height: 'calc(100vh - 120px)' }}>
          <Col span={16}>
            <Row gutter={[24, 24]} style={{ height: '100%' }}>
              <Col span={24}>
                <MenuSection
                  categories={mockDishCategories}
                  dishes={dishes}
                  onAddDish={handleAddDishToOrder}
                />
              </Col>
              <Col span={24}>
                <TableSelector tables={tables} onSelect={handleTableSelect} />
              </Col>
            </Row>
          </Col>

          <Col span={8}>
            <OrderHeader currentTime={currentTime} />

            <Card style={{ height: 'calc(100% - 160px)' }} bodyStyle={{ height: '100%', overflow: 'auto' }}>
              <OrderPanel hasTable={!!selectedTable} tableName={selectedTable ? getTableById(selectedTable)?.name : undefined}>
                {currentOrder && currentOrder.items.length > 0 ? (
                  <div>
                    {currentOrder.items.map(item => (
                      <div key={item.id} style={{ padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>{item.dishName}</Text>
                          <Text>x{item.quantity}</Text>
                        </div>
                        <Text type="secondary">{item.price.toFixed(2)} GNF</Text>
                      </div>
                    ))}
                    <div style={{ marginTop: '16px', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>Tổng cộng:</Text>
                        <Text strong style={{ color: '#1890ff' }}>{currentOrder.totalAmount.toFixed(2)} GNF</Text>
                      </div>
                    </div>
                  </div>
                ) : null}
              </OrderPanel>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default WaiterPage;


