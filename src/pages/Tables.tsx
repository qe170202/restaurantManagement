import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tag, 
  message,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Option } = Select;

const Tables = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form] = Form.useForm();

  // Mock data for tables
  const [tables, setTables] = useState([
    {
      key: '1',
      tableNumber: 1,
      capacity: 4,
      status: 'available',
      location: 'Tầng 1',
      currentOrder: null,
      lastUsed: '2024-01-15 13:30'
    },
    {
      key: '2',
      tableNumber: 2,
      capacity: 2,
      status: 'occupied',
      location: 'Tầng 1',
      currentOrder: 'ORD002',
      lastUsed: '2024-01-15 14:25'
    },
    {
      key: '3',
      tableNumber: 3,
      capacity: 6,
      status: 'reserved',
      location: 'Tầng 2',
      currentOrder: null,
      lastUsed: '2024-01-15 12:15'
    },
    {
      key: '4',
      tableNumber: 4,
      capacity: 4,
      status: 'cleaning',
      location: 'Tầng 1',
      currentOrder: null,
      lastUsed: '2024-01-15 14:00'
    },
    {
      key: '5',
      tableNumber: 5,
      capacity: 8,
      status: 'occupied',
      location: 'Tầng 2',
      currentOrder: 'ORD001',
      lastUsed: '2024-01-15 14:30'
    },
    {
      key: '6',
      tableNumber: 6,
      capacity: 2,
      status: 'available',
      location: 'Tầng 1',
      currentOrder: null,
      lastUsed: '2024-01-15 13:45'
    },
    {
      key: '7',
      tableNumber: 7,
      capacity: 4,
      status: 'occupied',
      location: 'Tầng 2',
      currentOrder: 'ORD003',
      lastUsed: '2024-01-15 14:20'
    },
    {
      key: '8',
      tableNumber: 8,
      capacity: 6,
      status: 'available',
      location: 'Tầng 1',
      currentOrder: null,
      lastUsed: '2024-01-15 13:20'
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'green',
      occupied: 'red',
      reserved: 'orange',
      cleaning: 'blue',
      maintenance: 'purple'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      available: 'Trống',
      occupied: 'Có khách',
      reserved: 'Đã đặt',
      cleaning: 'Đang dọn',
      maintenance: 'Bảo trì'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const handleAddTable = () => {
    setEditingTable(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTable = (table: any) => {
    setEditingTable(table);
    form.setFieldsValue(table);
    setIsModalVisible(true);
  };

  const handleDeleteTable = (key: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bàn này?',
      onOk() {
        setTables(tables.filter(table => table.key !== key));
        message.success('Xóa bàn thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const tableData = {
        ...values,
        key: editingTable ? (editingTable as any).key : Date.now().toString(),
        currentOrder: editingTable ? (editingTable as any).currentOrder : null,
        lastUsed: editingTable ? (editingTable as any).lastUsed : new Date().toISOString()
      };

      if (editingTable) {
        setTables(tables.map(table => 
          table.key === (editingTable as any).key ? tableData : table
        ));
        message.success('Cập nhật bàn thành công');
      } else {
        setTables([...tables, tableData]);
        message.success('Thêm bàn thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleTableClick = (table: any) => {
    if (table.status === 'occupied' && table.currentOrder) {
      Modal.info({
        title: `Thông tin bàn ${table.tableNumber}`,
        content: (
          <div>
            <p><strong>Trạng thái:</strong> <Tag color={getStatusColor(table.status)}>{getStatusText(table.status)}</Tag></p>
            <p><strong>Sức chứa:</strong> {table.capacity} người</p>
            <p><strong>Vị trí:</strong> {table.location}</p>
            <p><strong>Đơn hàng hiện tại:</strong> {table.currentOrder}</p>
            <p><strong>Lần sử dụng cuối:</strong> {table.lastUsed}</p>
          </div>
        ),
      });
    }
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
          Quản lý bàn
        </h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddTable}
        >
          Thêm bàn
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {tables.filter(t => t.status === 'available').length}
              </div>
              <div>Bàn trống</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {tables.filter(t => t.status === 'occupied').length}
              </div>
              <div>Bàn có khách</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                {tables.filter(t => t.status === 'reserved').length}
              </div>
              <div>Bàn đã đặt</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {tables.filter(t => t.status === 'cleaning').length}
              </div>
              <div>Đang dọn</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tables Grid */}
      <Card title="Sơ đồ bàn">
        <Row gutter={[16, 16]}>
          {tables.map(table => (
            <Col xs={24} sm={12} md={8} lg={6} key={table.key}>
              <Card
                hoverable
                style={{
                  cursor: 'pointer',
                  border: table.status === 'occupied' ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
                  position: 'relative'
                }}
                onClick={() => handleTableClick(table)}
                actions={[
                  <EditOutlined 
                    key="edit" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTable(table);
                    }}
                  />,
                  <DeleteOutlined 
                    key="delete" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTable(table.key);
                    }}
                  />
                ]}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: table.status === 'occupied' ? '#ff4d4f' : '#1890ff'
                  }}>
                    {table.tableNumber}
                  </div>
                  
                  <Tag 
                    color={getStatusColor(table.status)}
                    style={{ marginBottom: '8px' }}
                  >
                    {getStatusText(table.status)}
                  </Tag>
                  
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    <UserOutlined /> {table.capacity} người
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                    📍 {table.location}
                  </div>
                  
                  {table.currentOrder && (
                    <div style={{ fontSize: '12px', color: '#ff4d4f' }}>
                      <ClockCircleOutlined /> {table.currentOrder}
                    </div>
                  )}
                </div>
                
                {table.status === 'occupied' && (
                  <Badge 
                    status="processing" 
                    style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px' 
                    }} 
                  />
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Add/Edit Table Modal */}
      <Modal
        title={editingTable ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'available',
            capacity: 4,
            location: 'Tầng 1'
          }}
        >
          <Form.Item
            name="tableNumber"
            label="Số bàn"
            rules={[{ required: true, message: 'Vui lòng nhập số bàn' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          
          <Form.Item
            name="capacity"
            label="Sức chứa"
            rules={[{ required: true, message: 'Vui lòng nhập sức chứa' }]}
          >
            <Input type="number" min={1} max={20} />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="Vị trí"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
          >
            <Select>
              <Option value="Tầng 1">Tầng 1</Option>
              <Option value="Tầng 2">Tầng 2</Option>
              <Option value="Sân thượng">Sân thượng</Option>
              <Option value="Khu vực VIP">Khu vực VIP</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value="available">Trống</Option>
              <Option value="occupied">Có khách</Option>
              <Option value="reserved">Đã đặt</Option>
              <Option value="cleaning">Đang dọn</Option>
              <Option value="maintenance">Bảo trì</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tables;
