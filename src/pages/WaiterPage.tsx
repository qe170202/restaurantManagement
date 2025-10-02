import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { 
  mockDishCategories, 
  getTableById
} from '../services/mockTableData';
import MenuSection from '../features/waiter/menu/MenuSection';
import TableSelector from '../features/waiter/tables/TableSelector';
import OrderHeader from '../features/waiter/orders/OrderHeader';
import OrderPanel from '../features/waiter/orders/OrderPanel';
import OrderHistory from '../features/waiter/history/OrderHistory';
import { OrderProvider, useOrder } from '../contexts/OrderContext';

const { Content } = Layout;

const WaiterPageInner: React.FC = () => {
  const location = useLocation();
  const { 
    dishes,
    tables,
    selectedTableId,
    currentOrder,
    hasUnsavedChanges,
    isViewingHistoryOrder,
    addDishToOrder,
    selectTable,
    saveOrder,
    updateItemQuantity,
    cancelOrder,
    printBill,
    completePayment,
    applyHistoryOrder
  } = useOrder();
  // Clock is handled inside OrderHeader
  const [showOrderHistory, setShowOrderHistory] = useState<boolean>(false);

  // Moved clock into OrderHeader; keep no-op state to avoid rework

  // Xử lý khi quay lại từ trang thanh toán
  useEffect(() => {
    if (location.state?.paymentComplete && location.state?.tableId) {
      const tableId = location.state.tableId;
      completePayment(tableId);
      
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [completePayment, location.state]);


  const handleShowOrderHistory = () => {
    setShowOrderHistory(true);
  };

  const handleCloseOrderHistory = () => {
    setShowOrderHistory(false);
  };

  

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />
      <Content style={{ padding: '24px', position: 'relative' }} className="page-enter">
        <Row gutter={[24, 24]} style={{ height: 'calc(100vh - 120px)' }}>
          <Col span={16}>
            <Row gutter={[24, 24]} style={{ height: '100%' }}>
              <Col span={24}>
                <MenuSection
                  categories={mockDishCategories}
                  dishes={dishes}
                  onAddDish={(dish) => {
                    // delegate to context to add dish
                    // addDishToOrder is accessed via OrderPanel or context directly
                    // For now, use context directly here to minimize churn
                    // but keep MenuSection signature unchanged
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    addDishToOrder(dish);
                  }}
                />
              </Col>
              <Col span={24}>
                <TableSelector 
                  tables={tables} 
                  currentOrder={currentOrder || undefined}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onSelect={selectTable}
                  onSaveOrder={saveOrder}
                />
              </Col>
            </Row>
          </Col>

          <Col span={8}>
            <OrderHeader onShowPreviousOrders={handleShowOrderHistory} />

            <Card style={{ height: 'calc(100% - 160px)' }} bodyStyle={{ height: '100%', padding: 0 }}>
              <OrderPanel 
                hasTable={!!selectedTableId} 
                tableName={selectedTableId ? getTableById(selectedTableId)?.name : undefined}
                tableFloor={selectedTableId ? getTableById(selectedTableId)?.floor : undefined}
                order={currentOrder || undefined}
                dishes={dishes}
                isHistoryView={isViewingHistoryOrder}
                onUpdateQuantity={updateItemQuantity}
                onSaveOrder={saveOrder}
                onCancelOrder={cancelOrder}
                onPrintBill={printBill}
                onPaymentComplete={completePayment}
              />
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Order History Drawer */}
      <OrderHistory 
        visible={showOrderHistory}
        onClose={handleCloseOrderHistory}
        onSelectOrder={(order) => {
          applyHistoryOrder(order);
        }}
      />
    </Layout>
  );
};

const WaiterPage: React.FC = () => {
  return (
    <OrderProvider>
      <WaiterPageInner />
    </OrderProvider>
  );
};

export default WaiterPage;


