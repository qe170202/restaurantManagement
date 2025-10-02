import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, message } from 'antd';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { 
  mockDishCategories, 
  mockDishes, 
  mockTablesFloor1, 
  getTableById
} from '../services/mockTableData';
import orderService from '../services/orderService';
import orderHistoryService from '../services/orderHistoryService';
import type { Dish, Table, Order } from '../types/tableManagement';
import MenuSection from '../features/waiter/menu/MenuSection';
import TableSelector from '../features/waiter/tables/TableSelector';
import OrderHeader from '../features/waiter/orders/OrderHeader';
import OrderPanel from '../features/waiter/orders/OrderPanel';
import OrderHistory from '../features/waiter/history/OrderHistory';

const { Content } = Layout;

const WaiterPage: React.FC = () => {
  const { authState } = useAuth();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [dishes] = useState<Dish[]>(mockDishes);
  const [tables, setTables] = useState<Table[]>(mockTablesFloor1);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showOrderHistory, setShowOrderHistory] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

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
    setHasUnsavedChanges(false); // Reset khi chuyển bàn
    
    const existingOrder = orderService.getActiveOrderByTableId(tableId);
    if (existingOrder) {
      // Update prices for existing order items with current dish prices
      const updatedOrder = {
        ...existingOrder,
        items: existingOrder.items.map(item => {
          const currentDish = dishes.find(d => d.id === item.dishId);
          return currentDish ? { ...item, price: currentDish.price } : item;
        })
      };
      // Recalculate total with updated prices
      updatedOrder.totalAmount = updatedOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      setCurrentOrder(updatedOrder);
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
    setHasUnsavedChanges(true); // Đánh dấu có thay đổi
    message.success(`Đã thêm ${dish.name} vào đơn hàng`);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (!currentOrder) return;
    
    if (quantity === 0) {
      // Remove item if quantity is 0
      const updatedOrder = {
        ...currentOrder,
        items: currentOrder.items.filter(item => item.id !== itemId),
      };
      updatedOrder.totalAmount = updatedOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      setCurrentOrder(updatedOrder);
      setHasUnsavedChanges(true); // Đánh dấu có thay đổi
      message.success('Đã xóa món khỏi đơn hàng');
    } else {
      // Update quantity and ensure price is from current dishes data
      const updatedOrder = {
        ...currentOrder,
        items: currentOrder.items.map(item => {
          if (item.id === itemId) {
            // Find current dish price from dishes array
            const currentDish = dishes.find(d => d.id === item.dishId);
            return { 
              ...item, 
              quantity,
              price: currentDish ? currentDish.price : item.price // Use current dish price if found
            };
          }
          return item;
        }),
      };
      updatedOrder.totalAmount = updatedOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      setCurrentOrder(updatedOrder);
      setHasUnsavedChanges(true); // Đánh dấu có thay đổi
    }
  };

  const handleSaveOrder = () => {
    if (!currentOrder) {
      message.warning('Không có đơn hàng để lưu');
      return;
    }

    if (!currentOrder.items || currentOrder.items.length === 0) {
      message.warning('Không thể lưu đơn hàng trống. Vui lòng thêm món ăn trước khi lưu.');
      return;
    }

    try {
      // Lưu order vào localStorage
      orderHistoryService.saveOrder(currentOrder);
      
      // Kiểm tra xem đây là cập nhật hay tạo mới
      const history = orderHistoryService.getOrderHistory();
      const existingOrder = history.find(order => 
        order.id === currentOrder.id || 
        (order.tableId === currentOrder.tableId && order.status === 'saved')
      );
      
      if (existingOrder && existingOrder.id === currentOrder.id) {
        message.success('Đã cập nhật đơn hàng trong lịch sử');
      } else {
        message.success('Đã lưu đơn hàng vào lịch sử');
      }
      
      // Reset unsaved changes flag after successful save
      setHasUnsavedChanges(false);
      
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Lỗi khi lưu đơn hàng');
      }
      console.error('Save order error:', error);
    }
  };

  const handleCancelOrder = () => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, items: [] });
      setHasUnsavedChanges(false); // Reset unsaved changes flag
      message.info('Đã hủy đơn hàng');
    }
  };

  const handlePrintBill = () => {
    message.success('Đang xuất hóa đơn...');
  };

  const handlePayment = () => {
    message.success('Chuyển đến màn hình thanh toán');
  };

  const handleShowOrderHistory = () => {
    setShowOrderHistory(true);
  };

  const handleCloseOrderHistory = () => {
    setShowOrderHistory(false);
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
                <TableSelector 
                  tables={tables} 
                  currentOrder={currentOrder}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onSelect={handleTableSelect}
                  onSaveOrder={handleSaveOrder}
                />
              </Col>
            </Row>
          </Col>

          <Col span={8}>
            <OrderHeader 
              currentTime={currentTime} 
              onShowPreviousOrders={handleShowOrderHistory}
            />

            <Card style={{ height: 'calc(100% - 160px)' }} bodyStyle={{ height: '100%', padding: 0 }}>
              <OrderPanel 
                hasTable={!!selectedTable} 
                tableName={selectedTable ? getTableById(selectedTable)?.name : undefined}
                tableFloor={selectedTable ? getTableById(selectedTable)?.floor : undefined}
                order={currentOrder || undefined}
                dishes={dishes}
                onUpdateQuantity={handleUpdateQuantity}
                onSaveOrder={handleSaveOrder}
                onCancelOrder={handleCancelOrder}
                onPrintBill={handlePrintBill}
                onPayment={handlePayment}
              />
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Order History Drawer */}
      <OrderHistory 
        visible={showOrderHistory}
        onClose={handleCloseOrderHistory}
      />
    </Layout>
  );
};

export default WaiterPage;


