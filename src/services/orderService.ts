import type { Order, Dish } from '../types/tableManagement';
import { getOrderByTableId, createNewOrder, addItemToOrder } from './mockTableData';

export interface CreateOrderArgs {
  tableId: string;
  waiterId: string;
  waiterName: string;
}

export const orderService = {
  getActiveOrderByTableId(tableId: string): Order | undefined {
    return getOrderByTableId(tableId);
  },

  createOrderForTable({ tableId, waiterId, waiterName }: CreateOrderArgs): Order {
    return createNewOrder(tableId, waiterId, waiterName);
  },

  addItem(order: Order, dish: Dish, quantity = 1): Order {
    return addItemToOrder(order, dish, quantity);
  }
};

export default orderService;


