import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Row, 
  Col, 
  message, 
  Spin,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  ShopOutlined,
  CrownOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { getLoginError } from '../services/mockUsers';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      // Kiểm tra lỗi chi tiết trước khi gọi login
      const errorType = getLoginError(values.username, values.password);
      if (errorType === 'USERNAME') {
        message.error('Tên đăng nhập không tồn tại!');
        return;
      }
      if (errorType === 'PASSWORD') {
        message.error('Mật khẩu không đúng!');
        return;
      }

      // Gọi login với username không phân biệt hoa thường
      const success = await login({
        username: values.username.trim().toLowerCase(),
        password: values.password
      });
      if (success) {
        message.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        message.error('Tên đăng nhập hoặc mật khẩu không đúng!');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Row justify="center" style={{ width: '100%', maxWidth: '1200px' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            style={{
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            bodyStyle={{ padding: '40px' }}
            className="fade-scale"
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ 
                fontSize: '48px', 
                color: '#1890ff', 
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ShopOutlined />
              </div>
              <Title level={2} style={{ margin: 0, color: '#262626' }}>
                <span style={{ color: '#0088FF' }}>ShineWay</span> Restaurant
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Hệ thống quản lý nhà hàng
              </Text>
            </div>

            {/* Login Form */}
            <Form
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#999' }} />}
                  placeholder="Nhập tên đăng nhập"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999' }} />}
                  placeholder="Nhập mật khẩu"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: '24px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? <Spin size="small" /> : 'Đăng nhập'}
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            {/* Demo Accounts */}
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: '14px', marginBottom: '16px', display: 'block' }}>
                Tài khoản demo:
              </Text>
              
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card 
                    size="small" 
                    style={{ 
                      textAlign: 'center',
                      background: '#f6ffed',
                      border: '1px solid #b7eb8f'
                    }}
                  >
                    <CrownOutlined style={{ color: '#faad14', fontSize: '20px', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#262626' }}>
                      Admin
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      admin / admin123
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card 
                    size="small" 
                    style={{ 
                      textAlign: 'center',
                      background: '#e6f7ff',
                      border: '1px solid #91d5ff'
                    }}
                  >
                    <TeamOutlined style={{ color: '#1890ff', fontSize: '20px', marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#262626' }}>
                      Bồi bàn
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      waiter1 / waiter123
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
