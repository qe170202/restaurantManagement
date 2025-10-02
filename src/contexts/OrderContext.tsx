import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { useAuth } from './AuthContext';
import type { Dish, Order, Table } from '../types/tableManagement';
import { mockDishes, mockTablesFloor1, getTableById } from '../services/mockTableData';
import orderService from '../services/orderService';
import orderHistoryService from '../services/orderHistoryService';

interface OrderContextState {
  dishes: Dish[];
  tables: Table[];
  selectedTableId: string | null;
  currentOrder: Order | null;
  hasUnsavedChanges: boolean;
  isViewingHistoryOrder: boolean;
  // actions
  selectTable: (tableId: string) => void;
  addDishToOrder: (dish: Dish) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  saveOrder: () => void;
  cancelOrder: () => void;
  printBill: () => void;
  completePayment: (tableId: string) => void;
  applyHistoryOrder: (order: Order) => void;
  setHasUnsavedChanges: (changed: boolean) => void;
}

const OrderContext = createContext<OrderContextState | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState } = useAuth();
  const [dishes] = useState<Dish[]>(mockDishes);
  const [tables, setTables] = useState<Table[]>(mockTablesFloor1);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isViewingHistoryOrder, setIsViewingHistoryOrder] = useState<boolean>(false);

  const getTableStatus = useCallback((tableId: string) => {
    const savedOrders = orderHistoryService.getOrderHistory();
    const savedOrder = savedOrders.find((order: Order) => 
      order.tableId === tableId && 
      (order.status === 'saved' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready' || order.status === 'served')
    );
    const activeOrder = orderService.getActiveOrderByTableId(tableId);
    if (savedOrder && savedOrder.status !== 'paid') {
      return 'occupied' as const;
    } else if (activeOrder && activeOrder.items.length > 0) {
      return 'occupied' as const;
    }
    return 'empty' as const;
  }, []);

  useEffect(() => {
    // Sync table status on mount
    const updatedTables = tables.map(table => ({
      ...table,
      status: getTableStatus(table.id) as any
    }));
    setTables(updatedTables);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recalcOrderTotalsWithCurrentPrices = useCallback((order: Order): Order => {
    const updatedItems = order.items.map(item => {
      const currentDish = dishes.find(d => d.id === item.dishId);
      return currentDish ? { ...item, price: currentDish.price } : item;
    });
    const totalAmount = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return { ...order, items: updatedItems, totalAmount };
  }, [dishes]);

  const selectTable = useCallback((tableId: string) => {
    const table = getTableById(tableId);
    if (!table) return;

    // update table statuses
    const updatedTables = tables.map(t => ({
      ...t,
      status: t.id === tableId ? 'selected' as const : (t.status === 'selected' ? getTableStatus(t.id) as any : t.status)
    }));
    setTables(updatedTables);
    setSelectedTableId(tableId);
    setHasUnsavedChanges(false);
    setIsViewingHistoryOrder(false);

    // try load saved order first
    const savedOrders = orderHistoryService.getOrderHistory();
    const savedOrder = savedOrders.find((o: Order) => 
      o.tableId === tableId && 
      (o.status === 'saved' || o.status === 'confirmed' || o.status === 'preparing' || o.status === 'ready' || o.status === 'served')
    );
    if (savedOrder) {
      const updatedOrder = recalcOrderTotalsWithCurrentPrices(savedOrder);
      setCurrentOrder(updatedOrder);
      return;
    }

    // else check active order
    const existingOrder = orderService.getActiveOrderByTableId(tableId);
    if (existingOrder) {
      const updatedOrder = recalcOrderTotalsWithCurrentPrices(existingOrder);
      setCurrentOrder(updatedOrder);
      return;
    }

    // create new order
    const newOrder = orderService.createOrderForTable({
      tableId,
      waiterId: authState.user?.id || '',
      waiterName: authState.user?.fullName || ''
    });
    setCurrentOrder(newOrder);
  }, [authState.user?.fullName, authState.user?.id, getTableStatus, recalcOrderTotalsWithCurrentPrices, tables]);

  const addDishToOrder = useCallback((dish: Dish) => {
    if (!selectedTableId || !currentOrder) {
      message.warning('Vui lòng chọn bàn trước khi thêm món');
      return;
    }
    const updatedOrder = orderService.addItem(currentOrder, dish);
    setCurrentOrder(updatedOrder);
    setHasUnsavedChanges(true);
    message.success(`Đã thêm ${dish.name} vào đơn hàng`);
  }, [currentOrder, selectedTableId]);

  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (!currentOrder) return;
    let updatedOrder: Order;
    if (quantity === 0) {
      updatedOrder = { ...currentOrder, items: currentOrder.items.filter(item => item.id !== itemId) };
    } else {
      updatedOrder = {
        ...currentOrder,
        items: currentOrder.items.map(item => item.id === itemId ? {
          ...item,
          quantity,
          price: (dishes.find(d => d.id === item.dishId)?.price ?? item.price)
        } : item)
      };
    }
    updatedOrder.totalAmount = updatedOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    setCurrentOrder(updatedOrder);
    setHasUnsavedChanges(true);
  }, [currentOrder, dishes]);

  const saveOrder = useCallback(() => {
    if (!currentOrder) {
      message.warning('Không có đơn hàng để lưu');
      return;
    }
    if (!currentOrder.items || currentOrder.items.length === 0) {
      message.warning('Không thể lưu đơn hàng trống. Vui lòng thêm món ăn trước khi lưu.');
      return;
    }
    try {
      orderHistoryService.saveOrder(currentOrder);
      const history = orderHistoryService.getOrderHistory();
      const existingOrder = history.find(order => order.id === currentOrder.id || (order.tableId === currentOrder.tableId && order.status === 'saved'));
      if (existingOrder && existingOrder.id === currentOrder.id) {
        message.success('Đã cập nhật đơn hàng trong lịch sử');
      } else {
        message.success('Đã lưu đơn hàng vào lịch sử');
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Lỗi khi lưu đơn hàng');
      }
      // eslint-disable-next-line no-console
      console.error('Save order error:', error);
    }
  }, [currentOrder]);

  const cancelOrder = useCallback(() => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, items: [] });
      setHasUnsavedChanges(false);
      message.info('Đã hủy đơn hàng');
    }
  }, [currentOrder]);

  const printBill = useCallback(() => {
    message.success('Đang xuất hóa đơn...');
  }, []);

  const completePayment = useCallback((tableId: string) => {
    const updatedTables = tables.map(table => table.id === tableId ? { ...table, status: 'empty' as const } : table);
    setTables(updatedTables);
    setCurrentOrder(null);
    setHasUnsavedChanges(false);
    setIsViewingHistoryOrder(false);
    message.success('Đã cập nhật trạng thái bàn');
  }, [tables]);

  const applyHistoryOrder = useCallback((order: Order) => {
    setSelectedTableId(order.tableId);
    setCurrentOrder(recalcOrderTotalsWithCurrentPrices(order));
    setHasUnsavedChanges(false);
    setIsViewingHistoryOrder(true);
  }, [recalcOrderTotalsWithCurrentPrices]);

  const value: OrderContextState = useMemo(() => ({
    dishes,
    tables,
    selectedTableId,
    currentOrder,
    hasUnsavedChanges,
    isViewingHistoryOrder,
    selectTable,
    addDishToOrder,
    updateItemQuantity,
    saveOrder,
    cancelOrder,
    printBill,
    completePayment,
    applyHistoryOrder,
    setHasUnsavedChanges
  }), [addDishToOrder, applyHistoryOrder, cancelOrder, completePayment, currentOrder, dishes, hasUnsavedChanges, isViewingHistoryOrder, printBill, saveOrder, selectTable, selectedTableId, tables, updateItemQuantity]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextState => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
};

export default OrderContext;


