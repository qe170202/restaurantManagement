import type { Order } from '../types/tableManagement';

const ORDER_HISTORY_KEY = 'restaurant_order_history';

export const orderHistoryService = {
  // Lưu order vào localStorage
  saveOrder(order: Order): void {
    // Kiểm tra xem order có items không
    if (!order.items || order.items.length === 0) {
      throw new Error('Không thể lưu đơn hàng trống');
    }

    const history = this.getOrderHistory();
    const orderToSave = {
      ...order,
      status: 'saved' as const,
      savedAt: new Date().toISOString()
    };
    
    // Tìm xem đã có order này trong lịch sử chưa (theo tableId và orderId)
    const existingIndex = history.findIndex(existingOrder => 
      existingOrder.id === order.id || 
      (existingOrder.tableId === order.tableId && existingOrder.status === 'saved')
    );
    
    if (existingIndex !== -1) {
      // Cập nhật order hiện có
      history[existingIndex] = orderToSave;
    } else {
      // Thêm order mới vào đầu mảng
      history.unshift(orderToSave);
    }
    
    // Giới hạn lịch sử chỉ giữ 100 đơn gần nhất
    if (history.length > 100) {
      history.splice(100);
    }
    
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history));
  },

  // Lấy tất cả lịch sử orders
  getOrderHistory(): Order[] {
    try {
      const history = localStorage.getItem(ORDER_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading order history:', error);
      return [];
    }
  },

  // Lấy lịch sử orders theo bàn
  getOrderHistoryByTable(tableId: string): Order[] {
    return this.getOrderHistory().filter(order => order.tableId === tableId);
  },

  // Lấy lịch sử orders theo waiter
  getOrderHistoryByWaiter(waiterId: string): Order[] {
    return this.getOrderHistory().filter(order => order.waiterId === waiterId);
  },

  // Lấy lịch sử orders theo ngày
  getOrderHistoryByDate(date: string): Order[] {
    return this.getOrderHistory().filter(order => {
      const orderDate = new Date(order.createdAt).toDateString();
      const filterDate = new Date(date).toDateString();
      return orderDate === filterDate;
    });
  },

  // Xóa tất cả lịch sử
  clearHistory(): void {
    localStorage.removeItem(ORDER_HISTORY_KEY);
  },

  // Xóa một order cụ thể
  deleteOrder(orderId: string): void {
    const history = this.getOrderHistory();
    const updatedHistory = history.filter(order => order.id !== orderId);
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(updatedHistory));
  },

    // Kiểm tra xem order đã tồn tại chưa
  isOrderExists(orderId: string, tableId?: string): boolean {
    const history = this.getOrderHistory();
    return history.some(order => 
      order.id === orderId || 
      (tableId && order.tableId === tableId && order.status === 'saved')
    );
  },

  // Lấy thống kê
  getStatistics() {
    const history = this.getOrderHistory();
    const today = new Date().toDateString();
    const todayOrders = history.filter(order => {
      const orderDate = new Date(order.createdAt).toDateString();
      return orderDate === today;
    });

    return {
      totalOrders: history.length,
      todayOrders: todayOrders.length,
      totalRevenue: history.reduce((sum, order) => sum + order.totalAmount, 0),
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    };
  }
};

export default orderHistoryService;
