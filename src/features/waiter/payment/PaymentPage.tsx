import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Typography, 
  Button, 
  Row, 
  Col, 
  Divider,
  Radio,
  Input,
  message,
  Modal,
  Space
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CreditCardOutlined, 
  DollarOutlined,
  QrcodeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Order } from '../../../types/tableManagement';
import orderHistoryService from '../../../services/orderHistoryService';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PaymentPageProps {}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order as Order;

  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!order) {
      message.error('Không tìm thấy thông tin đơn hàng');
      navigate('/waiter');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const subtotal = order.totalAmount || 0;
  const discount = order.discountAmount || 0;
  const total = subtotal - discount;
  const change = receivedAmount - total;

  const paymentMethods = [
    { value: 'cash', label: 'Tiền mặt', icon: <DollarOutlined /> },
    { value: 'card', label: 'Thẻ tín dụng', icon: <CreditCardOutlined /> },
    { value: 'qr', label: 'QR Code', icon: <QrcodeOutlined /> },
  ];

  const handlePaymentConfirm = () => {
    if (paymentMethod === 'cash' && receivedAmount < total) {
      message.error('Số tiền nhận không đủ để thanh toán');
      return;
    }

    setShowConfirmModal(true);
  };

  const handlePaymentComplete = () => {
    try {
      // Cập nhật trạng thái order thành 'paid'
      const paidOrder = {
        ...order,
        status: 'paid' as 'paid',
        paymentMethod: paymentMethods.find(m => m.value === paymentMethod)?.label || paymentMethod,
        updatedAt: new Date().toISOString(),
        notes: notes
      };
      
      // Lưu order đã thanh toán vào localStorage
      orderHistoryService.saveOrder(paidOrder);
      
      setShowConfirmModal(false);
      
      message.success('Thanh toán thành công!');
      
      // Chuyển về trang waiter sau 1 giây
      setTimeout(() => {
        navigate('/waiter', { 
          state: { 
            paymentComplete: true, 
            tableId: order.tableId 
          } 
        });
      }, 1000);
      
    } catch (error) {
      message.error('Lỗi khi xử lý thanh toán');
      console.error('Payment error:', error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Layout.Content style={{ padding: '24px' }}>
        {/* Header */}
        <Card style={{ marginBottom: '24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/waiter')}
                style={{ marginRight: '16px' }}
              >
                Quay lại
              </Button>
              <Title level={3} style={{ margin: 0, display: 'inline' }}>
                Thanh toán - Bàn {order.tableName}
              </Title>
            </Col>
            <Col>
              <Text type="secondary">
                {new Date().toLocaleString('vi-VN')}
              </Text>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Order Summary */}
          <Col span={12}>
            <Card title="Thông tin đơn hàng" style={{ height: '100%' }}>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Khách hàng: </Text>
                <Text>{order.customerName || 'Khách lẻ'}</Text>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Nhân viên: </Text>
                <Text>{order.waiterName}</Text>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Thời gian tạo: </Text>
                <Text>{new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
              </div>

              <Divider />

              <div style={{ marginBottom: '16px' }}>
                <Text strong style={{ fontSize: '16px' }}>Chi tiết món ăn:</Text>
              </div>

              {order.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px',
                  padding: '8px 0'
                }}>
                  <div>
                    <Text>{item.dishName}</Text>
                    <Text type="secondary" style={{ marginLeft: '8px' }}>
                      x{item.quantity}
                    </Text>
                  </div>
                  <Text strong>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </Text>
                </div>
              ))}

              <Divider />

              <div style={{ marginBottom: '8px' }}>
                <Row justify="space-between">
                  <Col><Text>Tạm tính:</Text></Col>
                  <Col><Text>{subtotal.toLocaleString('vi-VN')}đ</Text></Col>
                </Row>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <Row justify="space-between">
                  <Col><Text>Giảm giá:</Text></Col>
                  <Col><Text style={{ color: '#ff4d4f' }}>-{discount.toLocaleString('vi-VN')}đ</Text></Col>
                </Row>
              </div>

              <Divider />

              <div style={{ marginBottom: '16px' }}>
                <Row justify="space-between">
                  <Col><Text strong style={{ fontSize: '18px' }}>Tổng cộng:</Text></Col>
                  <Col><Text strong style={{ fontSize: '18px', color: '#52c41a' }}>{total.toLocaleString('vi-VN')}đ</Text></Col>
                </Row>
              </div>
            </Card>
          </Col>

          {/* Payment Method */}
          <Col span={12}>
            <Card title="Phương thức thanh toán" style={{ marginBottom: '24px' }}>
              <Radio.Group 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {paymentMethods.map(method => (
                    <Radio key={method.value} value={method.value} style={{ 
                      padding: '12px',
                      border: paymentMethod === method.value ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: '8px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Space>
                        {method.icon}
                        <Text strong>{method.label}</Text>
                      </Space>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>

              {paymentMethod === 'cash' && (
                <div style={{ marginTop: '24px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    Số tiền khách đưa:
                  </Text>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền"
                    value={receivedAmount || ''}
                    onChange={(e) => setReceivedAmount(Number(e.target.value))}
                    suffix="đ"
                    style={{ marginBottom: '16px' }}
                  />
                  
                  {receivedAmount > 0 && (
                    <div>
                      <Row justify="space-between" style={{ marginBottom: '8px' }}>
                        <Col><Text>Tiền thừa:</Text></Col>
                        <Col>
                          <Text strong style={{ 
                            color: change >= 0 ? '#52c41a' : '#ff4d4f',
                            fontSize: '16px'
                          }}>
                            {change.toLocaleString('vi-VN')}đ
                          </Text>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card title="Ghi chú" style={{ marginBottom: '24px' }}>
              <TextArea
                rows={3}
                placeholder="Ghi chú thêm cho đơn hàng..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Card>

            <Card>
              <Button
                type="primary"
                size="large"
                block
                onClick={handlePaymentConfirm}
                style={{
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
                disabled={paymentMethod === 'cash' && receivedAmount < total}
              >
                Xác nhận thanh toán {total.toLocaleString('vi-VN')}đ
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Confirmation Modal */}
        <Modal
          title="Xác nhận thanh toán"
          open={showConfirmModal}
          onOk={handlePaymentComplete}
          onCancel={() => setShowConfirmModal(false)}
          okText="Xác nhận"
          cancelText="Hủy"
          centered
          maskClosable={false}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '22px' }} />
            <span>
              Xác nhận thanh toán cho bàn {order.tableName} với tổng tiền{' '}
              <strong style={{ color: '#52c41a' }}>
                {total.toLocaleString('vi-VN')}đ
              </strong>
              ?
            </span>
          </div>
          
          <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px' }}>
            <div style={{ marginBottom: '4px' }}>
              <Text strong>Phương thức: </Text>
              <Text>{paymentMethods.find(m => m.value === paymentMethod)?.label}</Text>
            </div>
            
            {paymentMethod === 'cash' && (
              <>
                <div style={{ marginBottom: '4px' }}>
                  <Text strong>Tiền nhận: </Text>
                  <Text>{receivedAmount.toLocaleString('vi-VN')}đ</Text>
                </div>
                <div>
                  <Text strong>Tiền thừa: </Text>
                  <Text>{change.toLocaleString('vi-VN')}đ</Text>
                </div>
              </>
            )}
          </div>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default PaymentPage;
