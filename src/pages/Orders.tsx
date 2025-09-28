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
  Form,
  InputNumber,
  message
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Orders = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();

  // Mock data for orders
  const [orders, setOrders] = useState([
    {
      key: '1',
      orderId: 'ORD001',
      customerName: 'Nguyễn Văn A',
      customerPhone: '0123456789',
      tableNumber: 'Bàn 5',
      orderDate: '2024-01-15',
      orderTime: '14:30',
      totalAmount: 450000,
      status: 'completed',
      items: [
        { name: 'Phở bò', quantity: 2, price: 150000 },
        { name: 'Nước ngọt', quantity: 2, price: 150000 }
      ]
    },
    {
      key: '2',
      orderId: 'ORD002',
      customerName: 'Trần Thị B',
      customerPhone: '0987654321',
      tableNumber: 'Bàn 12',
      orderDate: '2024-01-15',
      orderTime: '14:25',
      totalAmount: 320000,
      status: 'pending',
      items: [
        { name: 'Cơm tấm', quantity: 1, price: 120000 },
        { name: 'Canh chua', quantity: 1, price: 100000 },
        { name: 'Trà đá', quantity: 2, price: 100000 }
      ]
    },
    {
      key: '3',
      orderId: 'ORD003',
      customerName: 'Lê Văn C',
      customerPhone: '0369852147',
      tableNumber: 'Bàn 8',
      orderDate: '2024-01-15',
      orderTime: '14:20',
      totalAmount: 680000,
      status: 'preparing',
      items: [
        { name: 'Lẩu thái', quantity: 1, price: 350000 },
        { name: 'Bia', quantity: 3, price: 150000 },
        { name: 'Rau sống', quantity: 2, price: 180000 }
      ]
    },
    {
      key: '4',
      orderId: 'ORD004',
      customerName: 'Phạm Thị D',
      customerPhone: '0741258963',
      tableNumber: 'Bàn 3',
      orderDate: '2024-01-15',
      orderTime: '14:15',
      totalAmount: 290000,
      status: 'completed',
      items: [
        { name: 'Bún bò', quantity: 1, price: 120000 },
        { name: 'Chả cá', quantity: 1, price: 170000 }
      ]
    }
  ]);

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (record: any) => (
        <div>
          <div style={{ fontWeight: '500' }}>{record.customerName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: 'Bàn',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      width: 80,
    },
    {
      title: 'Thời gian',
      key: 'datetime',
      render: (record: any) => (
        <div>
          <div>{record.orderDate}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.orderTime}</div>
        </div>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`,
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          completed: { color: 'green', text: 'Hoàn thành' },
          pending: { color: 'orange', text: 'Chờ xử lý' },
          preparing: { color: 'blue', text: 'Đang chuẩn bị' },
          cancelled: { color: 'red', text: 'Đã hủy' }
        };
        const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      width: 120,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: any) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewOrder(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditOrder(record)}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            size="small"
            danger
            onClick={() => handleDeleteOrder(record.key)}
          />
        </Space>
      ),
      width: 120,
    },
  ];

  const handleViewOrder = (order: any) => {
    Modal.info({
      title: `Chi tiết đơn hàng ${order.orderId}`,
      width: 600,
      content: (
        <div>
          <p><strong>Khách hàng:</strong> {order.customerName}</p>
          <p><strong>Số điện thoại:</strong> {order.customerPhone}</p>
          <p><strong>Bàn:</strong> {order.tableNumber}</p>
          <p><strong>Thời gian:</strong> {order.orderDate} {order.orderTime}</p>
          <p><strong>Món ăn:</strong></p>
          <ul>
            {order.items.map((item: any, index: number) => (
              <li key={index}>
                {item.name} x{item.quantity} - {item.price.toLocaleString('vi-VN')} ₫
              </li>
            ))}
          </ul>
          <p><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString('vi-VN')} ₫</p>
        </div>
      ),
    });
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    form.setFieldsValue({
      ...order,
      orderDate: dayjs(order.orderDate),
    });
    setIsModalVisible(true);
  };

  const handleDeleteOrder = (key: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
      onOk() {
        setOrders(orders.filter(order => order.key !== key));
        message.success('Xóa đơn hàng thành công');
      },
    });
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const orderData = {
        ...values,
        orderDate: values.orderDate.format('YYYY-MM-DD'),
        key: editingOrder ? (editingOrder as any).key : Date.now().toString(),
        orderId: editingOrder ? (editingOrder as any).orderId : `ORD${String(orders.length + 1).padStart(3, '0')}`,
        items: editingOrder ? (editingOrder as any).items : []
      };

      if (editingOrder) {
        setOrders(orders.map(order => 
          order.key === (editingOrder as any).key ? orderData : order
        ));
        message.success('Cập nhật đơn hàng thành công');
      } else {
        setOrders([...orders, orderData]);
        message.success('Thêm đơn hàng thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
          Quản lý đơn hàng
        </h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddOrder}
        >
          Thêm đơn hàng
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm đơn hàng..."
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
              <Option value="pending">Chờ xử lý</Option>
              <Option value="preparing">Đang chuẩn bị</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Bàn"
              allowClear
              style={{ width: '100%' }}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <Option key={i + 1} value={`Bàn ${i + 1}`}>
                  Bàn {i + 1}
                </Option>
              ))}
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

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          pagination={{
            total: orders.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Add/Edit Order Modal */}
      <Modal
        title={editingOrder ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'pending'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Tên khách hàng"
                rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="customerPhone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tableNumber"
                label="Số bàn"
                rules={[{ required: true, message: 'Vui lòng chọn bàn' }]}
              >
                <Select placeholder="Chọn bàn">
                  {Array.from({ length: 20 }, (_, i) => (
                    <Option key={i + 1} value={`Bàn ${i + 1}`}>
                      Bàn {i + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orderDate"
                label="Ngày đặt"
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalAmount"
                label="Tổng tiền"
                rules={[{ required: true, message: 'Vui lòng nhập tổng tiền' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="₫"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select>
                  <Option value="pending">Chờ xử lý</Option>
                  <Option value="preparing">Đang chuẩn bị</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
