import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, message } from 'antd';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
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

  // Cập nhật trạng thái bàn khi component mount
  useEffect(() => {
    const updatedTables = tables.map(table => ({
      ...table,
      status: getTableStatus(table.id) as any
    }));
    setTables(updatedTables);
  }, []);

  // Xử lý khi quay lại từ trang thanh toán
  useEffect(() => {
    if (location.state?.paymentComplete && location.state?.tableId) {
      const tableId = location.state.tableId;
      
      // Cập nhật trạng thái bàn thành trống
      const updatedTables = tables.map(t => ({
        ...t,
        status: t.id === tableId ? 'empty' as const : t.status
      }));
      setTables(updatedTables);
      
      // Reset selected table và current order nếu đang ở bàn vừa thanh toán
      if (selectedTable === tableId) {
        setSelectedTable(null);
        setCurrentOrder(null);
      }
      
      setHasUnsavedChanges(false);
      
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, selectedTable, tables]);

  // Menu filtering is now handled inside MenuSection

  const getTableStatus = (tableId: string) => {
    // Kiểm tra saved orders từ localStorage
    const savedOrders = orderHistoryService.getOrderHistory();
    const savedOrder = savedOrders.find((order: Order) => 
      order.tableId === tableId && 
      (order.status === 'saved' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready' || order.status === 'served')
    );
    
    // Kiểm tra active orders
    const activeOrder = orderService.getActiveOrderByTableId(tableId);
    
    if (savedOrder && savedOrder.status !== 'paid') {
      return 'occupied'; // Bàn đang dùng nếu có đơn hàng chưa thanh toán
    } else if (activeOrder && activeOrder.items.length > 0) {
      return 'occupied'; // Bàn đang dùng nếu có đơn hàng active
    } else {
      return 'empty'; // Bàn trống
    }
  };

  const handleTableSelect = (tableId: string) => {
    const table = getTableById(tableId);
    if (!table) return;
    
    // Cập nhật trạng thái bàn dựa trên logic mới
    const updatedTables = tables.map(t => ({
      ...t,
      status: t.id === tableId ? 'selected' as const : 
              (t.status === 'selected' ? getTableStatus(t.id) as any : t.status)
    }));
    setTables(updatedTables);
    setSelectedTable(tableId);
    setHasUnsavedChanges(false); // Reset khi chuyển bàn
    
    // Kiểm tra saved order trước
    const savedOrders = orderHistoryService.getOrderHistory();
    const savedOrder = savedOrders.find((order: Order) => 
      order.tableId === tableId && 
      (order.status === 'saved' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready' || order.status === 'served')
    );
    
    if (savedOrder) {
      // Load saved order và update giá
      const updatedOrder = {
        ...savedOrder,
        items: savedOrder.items.map((item: any) => {
          const currentDish = dishes.find(d => d.id === item.dishId);
          return currentDish ? { ...item, price: currentDish.price } : item;
        })
      };
      updatedOrder.totalAmount = updatedOrder.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
      setCurrentOrder(updatedOrder);
    } else {
      // Kiểm tra active order
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


