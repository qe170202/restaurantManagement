import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Button, Input, Select, Typography, Space, message } from 'antd';
import { 
  ArrowLeftOutlined, 
  PlusOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { 
  mockDishCategories, 
  mockDishes, 
  mockTablesFloor1, 
  mockWaiterShift,
  getTableStatusSummary,
  getDishesByCategory,
  getTableById,
  getOrderByTableId,
  createNewOrder,
  addItemToOrder
} from '../services/mockTableData';
import type { Dish, Table, Order } from '../types/tableManagement';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const TableManagement: React.FC = () => {
  const { authState } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('1');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dishes, setDishes] = useState<Dish[]>(mockDishes);
  const [tables, setTables] = useState<Table[]>(mockTablesFloor1);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter dishes based on category and search
  useEffect(() => {
    let filteredDishes = getDishesByCategory(selectedCategory);
    
    if (searchTerm) {
      filteredDishes = filteredDishes.filter(dish => 
        dish.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setDishes(filteredDishes);
  }, [selectedCategory, searchTerm]);

  const handleTableSelect = (tableId: string) => {
    const table = getTableById(tableId);
    if (!table) return;

    // Update table status
    const updatedTables = tables.map(t => ({
      ...t,
      status: t.id === tableId ? 'selected' as const : (t.status === 'selected' ? 'empty' as const : t.status)
    }));
    setTables(updatedTables);
    setSelectedTable(tableId);

    // Check for existing order
    const existingOrder = getOrderByTableId(tableId);
    if (existingOrder) {
      setCurrentOrder(existingOrder);
    } else {
      // Create new order
      const newOrder = createNewOrder(tableId, authState.user?.id || '', authState.user?.fullName || '');
      setCurrentOrder(newOrder);
    }
  };

  const handleAddDishToOrder = (dish: Dish) => {
    if (!selectedTable || !currentOrder) {
      message.warning('Vui lòng chọn bàn trước khi thêm món');
      return;
    }

    const updatedOrder = addItemToOrder(currentOrder, dish);
    setCurrentOrder(updatedOrder);
    message.success(`Đã thêm ${dish.name} vào đơn hàng`);
  };

  const handleScrollLeft = () => {
    const scrollContainer = document.getElementById('dishes-scroll');
    if (scrollContainer) {
      const scrollAmount = 180; // Scroll by one card width + gap
      const newPosition = Math.max(0, scrollContainer.scrollLeft - scrollAmount);
      scrollContainer.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    const scrollContainer = document.getElementById('dishes-scroll');
    if (scrollContainer) {
      const scrollAmount = 180; // Scroll by one card width + gap
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const newPosition = Math.min(maxScroll, scrollContainer.scrollLeft + scrollAmount);
      scrollContainer.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = e.currentTarget;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    setIsDragging(false);
    container.style.cursor = 'grab';
    container.style.userSelect = 'auto';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    setIsDragging(false);
    container.style.cursor = 'grab';
    container.style.userSelect = 'auto';
  };

  const tableStatusSummary = getTableStatusSummary(tables);

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'empty':
        return '#1890ff';
      case 'selected':
        return '#52c41a';
      case 'occupied':
      case 'reserved':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };


  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header />

      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]} style={{ height: 'calc(100vh - 120px)' }}>
          {/* Left Panel - Menu and Tables */}
          <Col span={16}>
            <Row gutter={[24, 24]} style={{ height: '100%' }}>
              {/* Menu Section */}
              <Col span={24}>
                <div style={{ 
                  width: '1250px',
                  height: '400px', 
                  background: '#D9D9D9', 
                  borderRadius: '16px', 
                  overflow: 'hidden'
                }}>
                  {/* Header with title and search */}
                  <div style={{ 
                    background: '#5296E5',
                    padding: '16px',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderRadius: '16px 16px 0 0'
                  }}>
                    <Title level={4} style={{ color: 'white', margin: 0 }}>
                      Danh mục các món
                    </Title>
                    <Input
                      placeholder="Nhập tên món ăn...."
                      prefix={<SearchOutlined style={{ color: '#666' }} />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ 
                        width: '300px',
                        borderRadius: '20px',
                        border: 'none'
                      }}
                    />
                  </div>

                  {/* Content Area */}
                  <div style={{ padding: '16px', height: 'calc(100% - 80px)' }}>
                    {/* Categories */}
                    <div style={{ marginBottom: '16px' }}>
                      <Space wrap>
                        {mockDishCategories.map(category => (
                          <Button
                            key={category.id}
                            type={selectedCategory === category.id ? 'primary' : 'default'}
                            onClick={() => setSelectedCategory(category.id)}
                            style={{ 
                              borderRadius: '20px',
                              backgroundColor: selectedCategory === category.id ? '#1A72DD' : 'white',
                              borderColor: selectedCategory === category.id ? '#1A72DD' : '#d9d9d9',
                              color: selectedCategory === category.id ? 'white' : '#666',
                              border: '1px solid #d9d9d9'
                            }}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </Space>
                    </div>

                    {/* Navigation Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '16px' 
                    }}>
                      <Button
                        type="primary"
                        icon={<LeftOutlined />}
                        onClick={handleScrollLeft}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#1A72DD',
                          borderColor: '#1A72DD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                      />
                      <Button
                        type="primary"
                        icon={<RightOutlined />}
                        onClick={handleScrollRight}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#1A72DD',
                          borderColor: '#1A72DD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                      />
                    </div>

                    {/* Dishes Horizontal Scroll */}
                    <div style={{ position: 'relative' }}>
                      <style>
                        {`
                          #dishes-scroll::-webkit-scrollbar {
                            display: none;
                          }
                          #dishes-scroll {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                          }
                        `}
                      </style>
                      <div 
                        id="dishes-scroll"
                        style={{ 
                          display: 'flex',
                          gap: '12px',
                          overflowX: 'auto',
                          overflowY: 'hidden',
                          padding: '0',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          height: '200px',
                          alignItems: 'flex-start',
                          scrollBehavior: 'smooth',
                          cursor: 'grab',
                          userSelect: 'none'
                        }}
                        onScroll={handleScroll}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                      >
                        {dishes.map(dish => (
                          <div
                            key={dish.id}
                            style={{
                              minWidth: '160px',
                              maxWidth: '160px',
                              height: '200px',
                              background: 'white',
                              borderRadius: '16px',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                              overflow: 'hidden',
                              flexShrink: 0,
                              cursor: 'pointer',
                              transition: 'transform 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            {/* Image Section - Fixed Height */}
                            <div style={{ 
                              height: '100px', 
                              background: `url(https://picsum.photos/200/120?random=${dish.id}) center/cover`,
                              borderRadius: '16px 16px 0 0',
                              flexShrink: 0
                            }}>
                            </div>
                            
                            {/* Content Section - Fixed Layout */}
                            <div style={{ 
                              padding: '12px', 
                              height: '100px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              flexShrink: 0
                            }}>
                              {/* Title and Requirements - Fixed Height */}
                              <div style={{ 
                                height: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start'
                              }}>
                                <Text strong style={{ 
                                  fontSize: '14px', 
                                  color: '#333',
                                  display: 'block',
                                  lineHeight: '1.2',
                                  marginBottom: '4px'
                                }}>
                                  {dish.name}
                                </Text>
                                {dish.requirements && (
                                  <Text type="secondary" style={{ 
                                    fontSize: '10px',
                                    display: 'block',
                                    lineHeight: '1.2'
                                  }}>
                                    ({dish.requirements})
                                  </Text>
                                )}
                              </div>
                              
                              {/* Price and Button - Fixed Height */}
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                height: '32px'
                              }}>
                                <Text strong style={{ 
                                  color: '#1A72DD', 
                                  fontSize: '13px'
                                }}>
                                  {dish.currency} {dish.price.toFixed(2)}
                                </Text>
                                
                                {/* Add Button - Bottom Right */}
                                <Button
                                  type="primary"
                                  icon={<PlusOutlined />}
                                  onClick={() => handleAddDishToOrder(dish)}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '10px',
                                    backgroundColor: '#1A72DD',
                                    borderColor: '#1A72DD',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    minWidth: '24px',
                                    flexShrink: 0,
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Table Selection Section */}
              <Col span={24}>
                <div style={{ 
                  borderRadius: '16px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ 
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}>
                    {/* Header */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '20px',
                      flexShrink: 0
                    }}>
                      <Title level={3} style={{ margin: 0, color: '#333' }}>
                        Chọn bàn
                      </Title>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          background: '#ff8c00',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          Ca: Tối
                        </div>
                        <Select defaultValue="1" style={{ width: 120 }}>
                          <Option value="1">Tầng 1</Option>
                        </Select>
                      </div>
                    </div>

                    {/* Table Status Summary */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '20px',
                      padding: '12px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      flexShrink: 0
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#1890ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {tableStatusSummary.empty}
                        </div>
                        <Text>Đang trống</Text>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#8c8c8c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {tableStatusSummary.occupied}
                        </div>
                        <Text>Đang dùng</Text>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#ff4d4f',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {tableStatusSummary.reserved}
                        </div>
                        <Text>Đặt trước</Text>
                      </div>

                      {tableStatusSummary.selected && (
                        <div style={{
                          background: '#e6f7ff',
                          color: '#1890ff',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          Đang chọn: {tableStatusSummary.selected}
                        </div>
                      )}
                    </div>

                    {/* Tables Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(8, 1fr)', 
                      gap: '8px',
                      flex: 1,
                      overflow: 'auto',
                      alignContent: 'start'
                    }}>
                      {tables.map(table => (
                        <Button
                          key={table.id}
                          style={{
                            height: '50px',
                            background: getTableStatusColor(table.status),
                            borderColor: getTableStatusColor(table.status),
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            border: table.status === 'selected' ? '2px dashed #1890ff' : '1px solid',
                            fontSize: '12px'
                          }}
                          onClick={() => handleTableSelect(table.id)}
                        >
                          {table.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>

          {/* Right Panel - Order Details */}
          <Col span={8}>
            <Card 
              title="Đơn hàng" 
              style={{ height: '100%' }}
              bodyStyle={{ height: 'calc(100% - 57px)', overflow: 'auto' }}
            >
              {/* Date and Time */}
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '24px',
                padding: '16px',
                background: '#f9f9f9',
                borderRadius: '8px'
              }}>
                <Text strong style={{ fontSize: '16px' }}>
                  {new Date().toLocaleDateString('vi-VN')}
                </Text>
                <br />
                <Text type="secondary">
                  <ClockCircleOutlined /> {currentTime}
                </Text>
              </div>

              {/* Previous Order Button */}
              <Button 
                icon={<ArrowLeftOutlined />}
                style={{ width: '100%', marginBottom: '24px' }}
              >
                Đơn hàng trước đó
              </Button>

              {/* Order Content */}
              {selectedTable ? (
                <div>
                  <Title level={4}>Đơn hàng cho bàn {getTableById(selectedTable)?.name}</Title>
                  
                  {currentOrder && currentOrder.items.length > 0 ? (
                    <div>
                      {currentOrder.items.map(item => (
                        <div key={item.id} style={{ 
                          padding: '12px', 
                          border: '1px solid #f0f0f0', 
                          borderRadius: '8px',
                          marginBottom: '8px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text strong>{item.dishName}</Text>
                            <Text>x{item.quantity}</Text>
                          </div>
                          <Text type="secondary">
                            {item.price.toFixed(2)} GNF
                          </Text>
                        </div>
                      ))}
                      
                      <div style={{ 
                        marginTop: '16px', 
                        padding: '12px', 
                        background: '#f9f9f9', 
                        borderRadius: '8px' 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>Tổng cộng:</Text>
                          <Text strong style={{ color: '#1890ff' }}>
                            {currentOrder.totalAmount.toFixed(2)} GNF
                          </Text>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Text type="secondary">
                      Chưa có món nào trong đơn hàng
                    </Text>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Text type="secondary">
                    Vui lòng chọn bàn để bắt đầu tạo đơn hàng
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default TableManagement;
