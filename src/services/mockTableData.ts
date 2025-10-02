import type { 
  Dish, 
  DishCategory, 
  Table, 
  Order, 
  OrderItem, 
  Floor, 
  TableStatusSummary,
  WaiterShift 
} from '../types/tableManagement';

// Mock dish categories
export const mockDishCategories: DishCategory[] = [
  { id: '1', name: 'Tất cả', nameEn: 'All' },
  { id: '2', name: 'Đồ nhậu', nameEn: 'Appetizers' },
  { id: '3', name: 'Lẩu', nameEn: 'Hotpot' },
  { id: '4', name: 'Đồ nướng', nameEn: 'Grilled' },
  { id: '5', name: 'Đồ uống', nameEn: 'Drinks' }
];

// Mock dishes
export const mockDishes: Dish[] = [
  {
    id: '1',
    name: 'Salad Tuna',
    price: 200000,
    currency: 'VND',
    category: '2',
    image: '/api/placeholder/150/120',
    isAvailable: true,
    requirements: 'Must choose level'
  },
  {
    id: '2',
    name: 'Salad Egg',
    price: 350500,
    currency: 'VND',
    category: '2',
    image: '/api/placeholder/150/120',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Wagyu Sate',
    price: 1200000,
    currency: 'VND',
    category: '4',
    image: '/api/placeholder/150/120',
    isAvailable: true,
    requirements: 'Must choose level'
  },
  {
    id: '4',
    name: 'Wagyu Black Paper',
    price: 1500000,
    currency: 'VND',
    category: '4',
    image: '/api/placeholder/150/120',
    isAvailable: true,
    requirements: 'Must choose level'
  },
  {
    id: '5',
    name: 'Wagyu',
    price: 2000000,
    currency: 'VND',
    category: '4',
    image: '/api/placeholder/150/120',
    isAvailable: true,
    requirements: 'Must choose level'
  },
  {
    id: '6',
    name: 'Lẩu Thái',
    price: 800000,
    currency: 'VND',
    category: '3',
    image: '/api/placeholder/150/120',
    isAvailable: true
  },
  {
    id: '7',
    name: 'Lẩu Hải Sản',
    price: 1200000,
    currency: 'VND',
    category: '3',
    image: '/api/placeholder/150/120',
    isAvailable: true
  },
  {
    id: '8',
    name: 'Coca Cola',
    price: 50000,
    currency: 'VND',
    category: '5',
    image: '/api/placeholder/150/120',
    isAvailable: true
  },
  {
    id: '9',
    name: 'Nước Cam',
    price: 80000,
    currency: 'VND',
    category: '5',
    image: '/api/placeholder/150/120',
    isAvailable: true
  },
  {
    id: '10',
    name: 'Bia Tiger',
    price: 120000,
    currency: 'VND',
    category: '5',
    image: '/api/placeholder/150/120',
    isAvailable: true
  }
];

// Mock tables for Floor 1 - 24 tables (3 rows x 8 columns)
export const mockTablesFloor1: Table[] = [
  // Row 1 (A1-A8)
  { id: '1', name: 'A1', floor: 1, capacity: 4, status: 'empty', position: { x: 0, y: 0 } },
  { id: '2', name: 'A2', floor: 1, capacity: 2, status: 'empty', position: { x: 1, y: 0 } },
  { id: '3', name: 'A3', floor: 1, capacity: 6, status: 'empty', position: { x: 2, y: 0 } },
  { id: '4', name: 'A4', floor: 1, capacity: 4, status: 'empty', position: { x: 3, y: 0 } },
  { id: '5', name: 'A5', floor: 1, capacity: 2, status: 'empty', position: { x: 4, y: 0 } },
  { id: '6', name: 'A6', floor: 1, capacity: 4, status: 'empty', position: { x: 5, y: 0 } },
  { id: '7', name: 'A7', floor: 1, capacity: 6, status: 'empty', position: { x: 6, y: 0 } },
  { id: '8', name: 'A8', floor: 1, capacity: 2, status: 'empty', position: { x: 7, y: 0 } },
  
  // Row 2 (B1-B8)
  { id: '9', name: 'B1', floor: 1, capacity: 4, status: 'empty', position: { x: 0, y: 1 } },
  { id: '10', name: 'B2', floor: 1, capacity: 2, status: 'selected', position: { x: 1, y: 1 } },
  { id: '11', name: 'B3', floor: 1, capacity: 6, status: 'empty', position: { x: 2, y: 1 } },
  { id: '12', name: 'B4', floor: 1, capacity: 4, status: 'empty', position: { x: 3, y: 1 } },
  { id: '13', name: 'B5', floor: 1, capacity: 2, status: 'reserved', position: { x: 4, y: 1 } },
  { id: '14', name: 'B6', floor: 1, capacity: 4, status: 'empty', position: { x: 5, y: 1 } },
  { id: '15', name: 'B7', floor: 1, capacity: 6, status: 'empty', position: { x: 6, y: 1 } },
  { id: '16', name: 'B8', floor: 1, capacity: 2, status: 'reserved', position: { x: 7, y: 1 } },
  
  // Row 3 (C1-C8)
  { id: '17', name: 'C1', floor: 1, capacity: 4, status: 'empty', position: { x: 0, y: 2 } },
  { id: '18', name: 'C2', floor: 1, capacity: 2, status: 'empty', position: { x: 1, y: 2 } },
  { id: '19', name: 'C3', floor: 1, capacity: 6, status: 'empty', position: { x: 2, y: 2 } },
  { id: '20', name: 'C4', floor: 1, capacity: 4, status: 'empty', position: { x: 3, y: 2 } },
  { id: '21', name: 'C5', floor: 1, capacity: 2, status: 'empty', position: { x: 4, y: 2 } },
  { id: '22', name: 'C6', floor: 1, capacity: 4, status: 'reserved', position: { x: 5, y: 2 } },
  { id: '23', name: 'C7', floor: 1, capacity: 6, status: 'empty', position: { x: 6, y: 2 } },
  { id: '24', name: 'C8', floor: 1, capacity: 2, status: 'reserved', position: { x: 7, y: 2 } }
];

// Mock floors
export const mockFloors: Floor[] = [
  {
    id: '1',
    name: 'Tầng 1',
    number: 1,
    tables: mockTablesFloor1
  }
];

// Mock orders
export const mockOrders: Order[] = [];

// Mock waiter shift
export const mockWaiterShift: WaiterShift = {
  id: '1',
  waiterId: '2',
  waiterName: 'Trần Thị B',
  startTime: '2025-01-19T08:00:00Z',
  isActive: true,
  floor: 1
};

// Helper functions
export const getTableStatusSummary = (tables: Table[]): TableStatusSummary => {
  const summary = {
    empty: 0,
    occupied: 0,
    reserved: 0,
    selected: undefined as string | undefined
  };

  tables.forEach(table => {
    switch (table.status) {
      case 'empty':
        summary.empty++;
        break;
      case 'occupied':
        summary.occupied++;
        break;
      case 'reserved':
        summary.reserved++;
        break;
      case 'selected':
        summary.selected = table.name;
        break;
    }
  });

  return summary;
};

export const getDishesByCategory = (categoryId: string): Dish[] => {
  if (categoryId === '1') { // All categories
    return mockDishes;
  }
  return mockDishes.filter(dish => dish.category === categoryId);
};

export const getTableById = (tableId: string): Table | undefined => {
  return mockTablesFloor1.find(table => table.id === tableId);
};

export const getOrderByTableId = (tableId: string): Order | undefined => {
  return mockOrders.find(order => order.tableId === tableId && order.status !== 'paid');
};

export const createNewOrder = (tableId: string, waiterId: string, waiterName: string): Order => {
  const table = getTableById(tableId);
  if (!table) {
    throw new Error('Table not found');
  }

  const newOrder: Order = {
    id: Date.now().toString(),
    tableId,
    tableName: table.name,
    waiterId,
    waiterName,
    items: [],
    status: 'draft',
    totalAmount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return newOrder;
};

export const addItemToOrder = (order: Order, dish: Dish, quantity: number = 1): Order => {
  const existingItem = order.items.find(item => item.dishId === dish.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      dishId: dish.id,
      dishName: dish.name,
      quantity,
      price: dish.price,
      status: 'pending'
    };
    order.items.push(newItem);
  }

  // Recalculate total
  order.totalAmount = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  order.updatedAt = new Date().toISOString();

  return order;
};
