import type { User } from '../types/auth';

// Mock data cho users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    fullName: 'Nguyễn Văn A',
    role: 'admin',
    avatar: '',
    phone: '0123456789',
    email: 'admin@shineway.com'
  },
  {
    id: '2',
    username: 'waiter1',
    password: 'waiter123',
    fullName: 'Trần Thị B',
    role: 'waiter',
    avatar: '',
    phone: '0987654321',
    email: 'waiter1@shineway.com'
  },
  {
    id: '3',
    username: 'waiter2',
    password: 'waiter123',
    fullName: 'Lê Văn C',
    role: 'waiter',
    avatar: '',
    phone: '0369852147',
    email: 'waiter2@shineway.com'
  },
  {
    id: '4',
    username: 'admin2',
    password: 'admin456',
    fullName: 'Phạm Thị D',
    role: 'admin',
    avatar: '',
    phone: '0741258963',
    email: 'admin2@shineway.com'
  }
];

// Hàm kiểm tra đăng nhập
export const authenticateUser = (username: string, password: string): User | null => {
  const user = mockUsers.find(
    u => u.username === username && u.password === password
  );
  return user || null;
};

// Hàm lấy user theo ID
export const getUserById = (id: string): User | null => {
  return mockUsers.find(u => u.id === id) || null;
};
