// Types for Table Management System

export interface Dish {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  isAvailable: boolean;
  requirements?: string; // e.g., "Must choose level"
  preparationTime?: number; // in minutes
}

export interface DishCategory {
  id: string;
  name: string;
  nameEn?: string;
  icon?: string;
}

export interface Table {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  status: 'empty' | 'occupied' | 'reserved' | 'selected';
  position: {
    x: number;
    y: number;
  };
  currentOrder?: string; // Order ID if table has an active order
}

export interface OrderItem {
  id: string;
  dishId: string;
  dishName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  waiterId: string;
  waiterName: string;
  items: OrderItem[];
  status: 'draft' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'saved' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  savedAt?: string;
  customerName?: string;
  discountAmount?: number;
  paymentMethod?: string;
}

export interface TableStatusSummary {
  empty: number;
  occupied: number;
  reserved: number;
  selected?: string;
}

export interface Floor {
  id: string;
  name: string;
  number: number;
  tables: Table[];
}

export interface WaiterShift {
  id: string;
  waiterId: string;
  waiterName: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  floor: number;
}
