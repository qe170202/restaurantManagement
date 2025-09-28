import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col,
  Modal,
  Statistic,
  Progress
} from 'antd';
import { 
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  CreditCardOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Payment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Mock data for payments
  const [payments] = useState([
    {
      key: '1',
      paymentId: 'PAY001',
      orderId: 'ORD001',
      customerName: 'Nguyễn Văn A',
      amount: 450000,
      paymentMethod: 'cash',
      status: 'completed',
      paymentDate: '2024-01-15',
      paymentTime: '14:35',
      cashier: 'Nhân viên A',
      notes: 'Thanh toán đầy đủ'
    },
    {
      key: '2',
      paymentId: 'PAY002',
      orderId: 'ORD002',
      customerName: 'Trần Thị B',
      amount: 320000,
      paymentMethod: 'card',
      status: 'completed',
      paymentDate: '2024-01-15',
      paymentTime: '14:30',
      cashier: 'Nhân viên B',
      notes: 'Thanh toán bằng thẻ'
    },
    {
      key: '3',
      paymentId: 'PAY003',
      orderId: 'ORD003',
      customerName: 'Lê Văn C',
      amount: 680000,
      paymentMethod: 'transfer',
      status: 'pending',
      paymentDate: '2024-01-15',
      paymentTime: '14:25',
      cashier: 'Nhân viên A',
      notes: 'Chuyển khoản ngân hàng'
    },
    {
      key: '4',
      paymentId: 'PAY004',
      orderId: 'ORD004',
      customerName: 'Phạm Thị D',
      amount: 290000,
      paymentMethod: 'cash',
      status: 'failed',
      paymentDate: '2024-01-15',
      paymentTime: '14:20',
      cashier: 'Nhân viên C',
      notes: 'Giao dịch thất bại'
    },
    {
      key: '5',
      paymentId: 'PAY005',
      orderId: 'ORD005',
      customerName: 'Hoàng Văn E',
      amount: 520000,
      paymentMethod: 'card',
      status: 'completed',
      paymentDate: '2024-01-15',
      paymentTime: '14:15',
      cashier: 'Nhân viên B',
      notes: 'Thanh toán thành công'
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'green',
      pending: 'orange',
      failed: 'red',
      refunded: 'purple'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      completed: 'Thành công',
      pending: 'Đang xử lý',
      failed: 'Thất bại',
      refunded: 'Đã hoàn tiền'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methods = {
      cash: 'Tiền mặt',
      card: 'Thẻ',
      transfer: 'Chuyển khoản',
      wallet: 'Ví điện tử'
    };
    return methods[method as keyof typeof methods] || method;
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      cash: <DollarOutlined />,
      card: <CreditCardOutlined />,
      transfer: <BankOutlined />,
      wallet: <CreditCardOutlined />
    };
    return icons[method as keyof typeof icons] || <DollarOutlined />;
  };

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã thanh toán',
      dataIndex: 'paymentId',
      key: 'paymentId',
      width: 120,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 120,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`,
      width: 120,
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => (
        <Space>
          {getPaymentMethodIcon(method)}
          {getPaymentMethodText(method)}
        </Space>
      ),
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === 'completed' && <CheckCircleOutlined />}
          {status === 'failed' && <CloseCircleOutlined />}
          {getStatusText(status)}
        </Tag>
      ),
      width: 120,
    },
    {
      title: 'Thời gian',
      key: 'datetime',
      render: (record: any) => (
        <div>
          <div>{record.paymentDate}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.paymentTime}</div>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Nhân viên',
      dataIndex: 'cashier',
      key: 'cashier',
      width: 120,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: any) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          size="small"
          onClick={() => handleViewPayment(record)}
        />
      ),
      width: 80,
    },
  ];

  // Calculate statistics
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalTransactions = payments.length;
  const successfulTransactions = payments.filter(p => p.status === 'completed').length;
  const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

  const paymentMethodStats = payments.reduce((acc, payment) => {
    if (payment.status === 'completed') {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h2 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '600' }}>
        Quản lý thanh toán
      </h2>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu hôm nay"
              value={totalRevenue}
              prefix="₫"
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng giao dịch"
              value={totalTransactions}
              suffix="giao dịch"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div>
              <div style={{ marginBottom: '8px' }}>Tỷ lệ thành công</div>
              <Progress 
                percent={Math.round(successRate)} 
                status={successRate >= 90 ? 'success' : successRate >= 70 ? 'normal' : 'exception'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Payment Method Statistics */}
      <Card title="Thống kê phương thức thanh toán" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {Object.entries(paymentMethodStats).map(([method, count]) => (
            <Col xs={24} sm={6} key={method}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                    {getPaymentMethodIcon(method)}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{count}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {getPaymentMethodText(method)}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm thanh toán..."
              allowClear
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="completed">Thành công</Option>
              <Option value="pending">Đang xử lý</Option>
              <Option value="failed">Thất bại</Option>
              <Option value="refunded">Đã hoàn tiền</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Phương thức"
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="cash">Tiền mặt</Option>
              <Option value="card">Thẻ</Option>
              <Option value="transfer">Chuyển khoản</Option>
              <Option value="wallet">Ví điện tử</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
        </Row>
      </Card>

      {/* Payments Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={payments}
          pagination={{
            total: payments.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} giao dịch`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Payment Detail Modal */}
      <Modal
        title={`Chi tiết thanh toán ${(selectedPayment as any)?.paymentId}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedPayment && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div><strong>Mã thanh toán:</strong> {(selectedPayment as any).paymentId}</div>
              </Col>
              <Col span={12}>
                <div><strong>Mã đơn hàng:</strong> {(selectedPayment as any).orderId}</div>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <div><strong>Khách hàng:</strong> {(selectedPayment as any).customerName}</div>
              </Col>
              <Col span={12}>
                <div><strong>Số tiền:</strong> {(selectedPayment as any).amount.toLocaleString('vi-VN')} ₫</div>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <div><strong>Phương thức:</strong> {getPaymentMethodText((selectedPayment as any).paymentMethod)}</div>
              </Col>
              <Col span={12}>
                <div><strong>Trạng thái:</strong> 
                  <Tag color={getStatusColor((selectedPayment as any).status)} style={{ marginLeft: '8px' }}>
                    {getStatusText((selectedPayment as any).status)}
                  </Tag>
                </div>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <div><strong>Thời gian:</strong> {(selectedPayment as any).paymentDate} {(selectedPayment as any).paymentTime}</div>
              </Col>
              <Col span={12}>
                <div><strong>Nhân viên:</strong> {(selectedPayment as any).cashier}</div>
              </Col>
            </Row>
            
            <div style={{ marginTop: '16px' }}>
              <strong>Ghi chú:</strong> {(selectedPayment as any).notes}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payment;
