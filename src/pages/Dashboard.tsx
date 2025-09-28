import { Row, Col, Card, Select, Button } from 'antd';
import { 
  DollarOutlined, 
  BookOutlined, 
  AppstoreOutlined, 
  FileTextOutlined,
  InboxOutlined,
  SettingOutlined,
  TeamOutlined,
  PrinterOutlined,
  MessageOutlined,
  SwapOutlined,
  CalendarOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('warehouse');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock data for warehouse management
  const warehouseData = {
    date: '19/08/2025',
    import: 1090000,
    export: 520000,
    chartData: [
      { date: '19/7/2025', import: 800000, export: 400000 },
      { date: '20/7/2025', import: 900000, export: 450000 },
      { date: '21/7/2025', import: 750000, export: 380000 },
      { date: '22/7/2025', import: 1100000, export: 500000 },
      { date: '19/8/2025', import: 1090000, export: 520000 }
    ]
  };

  // Mock data for revenue
  const revenueData = {
    totalExpense: 1090000,
    totalRevenue: 520000,
    pieData: [
      { name: 'Chi Tiêu', value: 1090000, color: '#ff4d4f' },
      { name: 'Thu Nhập', value: 520000, color: '#52c41a' }
    ]
  };

  // Get date range from chart data (fake API data)
  const getDateRange = (chartData: any[]) => {
    if (chartData.length === 0) return { startDate: '', endDate: '' };
    const dates = chartData.map(item => item.date);
    return {
      startDate: dates[0],
      endDate: dates[dates.length - 1]
    };
  };

  const warehouseDateRange = getDateRange(warehouseData.chartData);
  const revenueDateRange = getDateRange(warehouseData.chartData); // Using same date range for revenue

  // Mock data for applications
  const applications = [
    { name: 'Doanh thu', icon: <DollarOutlined />, color: '#1890ff' },
    { name: 'Thực đơn', icon: <BookOutlined />, color: '#52c41a' },
    { name: 'Hạ tầng', icon: <AppstoreOutlined />, color: '#722ed1' },
    { name: 'Lương', icon: <FileTextOutlined />, color: '#fa8c16' },
    { name: 'Kho', icon: <InboxOutlined />, color: '#f5222d' },
    { name: 'Cài đặt', icon: <SettingOutlined />, color: '#13c2c2' },
    { name: 'Nhân sự', icon: <TeamOutlined />, color: '#eb2f96' },
    { name: 'Hóa đơn', icon: <PrinterOutlined />, color: '#faad14' },
    { name: 'Phản hồi', icon: <MessageOutlined />, color: '#a0d911' },
    { name: 'Ca làm', icon: <SwapOutlined />, color: '#2f54eb' }
  ];


  return (
    <div style={{ 
      padding: '24px', 
      background: '#fff', 
      minHeight: '100vh',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 0.8s ease-out'
    }}>
      {/* Main Title */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '20px 0',
        width: '821px',
        height: '44px',
        margin: '0 auto 40px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out 0.2s'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold',
          color: '#1890ff',
          margin: 0,
          display: 'inline'
        }}>
          ShineWay
        </h1>
        <span style={{ 
          fontSize: '32px', 
          fontWeight: '500',
          color: '#333',
          marginLeft: '12px'
        }}>
          - Hệ thống hỗ trợ vận hành nhà hàng
        </span>
      </div>

      {/* Main Dashboard Container */}
      <div style={{
        background: '#5296E5',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(82, 150, 229, 0.2)',
        width: '1286px',
        height: '580px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
        transition: 'all 0.8s ease-out 0.4s'
      }}>
        <Row gutter={[32, 32]}>
          {/* Left Column - Warehouse Management */}
          <Col xs={24} lg={8}>
            {/* Header with Dropdown and Date Filter */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '24px',
              gap: '12px'
            }}>
              <Select
                value={selectedOption}
                onChange={setSelectedOption}
                style={{ 
                  width: '290px',
                  fontWeight: 'bold',
                  height: '40px'
                }}
                options={[
                  { value: 'warehouse', label: 'Xuất / Nhập kho' },
                  { value: 'revenue', label: 'Tổng doanh thu' }
                ]}
              />
              <div style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '40px',
                height: '40px'
              }}>
                <CalendarOutlined style={{ color: '#666' }} />
              </div>
            </div>
            
            {/* Info Card */}
            <Card style={{
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: 'none'
            }}>
              {selectedOption === 'warehouse' ? (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      color: '#52c41a', 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Nhập kho: {warehouseData.import.toLocaleString('vi-VN')}₫
                    </div>
                    <div style={{ 
                      color: '#ff4d4f', 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Xuất kho: {warehouseData.export.toLocaleString('vi-VN')}₫
                    </div>
                    <div style={{ 
                      color: '#1890ff', 
                      fontSize: '14px', 
                      fontWeight: '600'
                    }}>
                      Ngày: {warehouseDateRange.startDate} - {warehouseDateRange.endDate}
                    </div>
                  </div>
                  
                  {/* Legend for Line Chart */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '20px', 
                    marginBottom: '12px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#52c41a',
                        borderRadius: '50%'
                      }} />
                      <span style={{ fontSize: '12px', color: '#333' }}>Nhập kho</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#ff4d4f',
                        borderRadius: '50%'
                      }} />
                      <span style={{ fontSize: '12px', color: '#333' }}>Xuất kho</span>
                    </div>
                  </div>

                  {/* Line Chart */}
                  <div style={{ height: '180px', marginBottom: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={warehouseData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          stroke="#666"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          stroke="#666"
                          tickFormatter={(value) => `${(value/1000)}k`}
                        />
                        <Tooltip 
                          formatter={(value: any) => [`${value.toLocaleString('vi-VN')}₫`, '']}
                          labelStyle={{ color: '#333' }}
                        />
                        <RechartsLine 
                          type="monotone" 
                          dataKey="import" 
                          stroke="#52c41a" 
                          strokeWidth={3}
                          dot={{ fill: '#52c41a', strokeWidth: 2, r: 4 }}
                        />
                        <RechartsLine 
                          type="monotone" 
                          dataKey="export" 
                          stroke="#ff4d4f" 
                          strokeWidth={3}
                          dot={{ fill: '#ff4d4f', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      color: '#ff4d4f', 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Tổng Chi: {revenueData.totalExpense.toLocaleString('vi-VN')}₫
                    </div>
                    <div style={{ 
                      color: '#52c41a', 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Tổng thu: {revenueData.totalRevenue.toLocaleString('vi-VN')}₫
                    </div>
                    <div style={{ 
                      color: '#1890ff', 
                      fontSize: '14px', 
                      fontWeight: '600'
                    }}>
                      Ngày: {revenueDateRange.startDate} - {revenueDateRange.endDate}
                    </div>
                  </div>
                  
                  {/* Legend for Pie Chart */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '20px', 
                    marginBottom: '12px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#ff4d4f',
                        borderRadius: '2px'
                      }} />
                      <span style={{ fontSize: '12px', color: '#333' }}>Chi Tiêu</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#52c41a',
                        borderRadius: '2px'
                      }} />
                      <span style={{ fontSize: '12px', color: '#333' }}>Thu Nhập</span>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div style={{ height: '180px', marginBottom: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueData.pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {revenueData.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value.toLocaleString('vi-VN')}₫`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
              
              <div style={{ textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  icon={<ArrowRightOutlined />}
                  style={{
                    borderRadius: '8px',
                    background: '#5296E5',
                    border: 'none',
                    fontWeight: '500'
                  }}
                >
                  Chi tiết
                </Button>
              </div>
            </Card>
          </Col>

          {/* Divider Line */}
          <Col xs={24} lg={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              width: '1px',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              minHeight: '400px'
            }} />
          </Col>

          {/* Right Column - All Applications */}
          <Col xs={24} lg={15}>
            <h3 style={{ 
              color: '#fff', 
              fontSize: '24px', 
              fontWeight: '600',
              marginBottom: '32px'
            }}>
              Tất cả ứng dụng
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'repeat(2, auto)',
              gap: '8px 20px',
              height: '100%',
              alignItems: 'stretch'
            }}>
              {applications.map((app, index) => (
                <div
                  key={index}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '120px',
                    height: '160px',
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.8)',
                    transition: `all 0.5s ease-out ${0.6 + (index * 0.1)}s, transform 0.3s ease, box-shadow 0.3s ease`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    fontSize: '24px',
                    color: app.color,
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '32px'
                  }}>
                    {app.icon}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#333',
                    fontWeight: '500',
                    lineHeight: '1.1',
                    textAlign: 'center'
                  }}>
                    {app.name}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
