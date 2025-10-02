import { Layout, Avatar, Button, Input, Badge, Dropdown, Menu } from 'antd';
import { 
  UserOutlined, 
  SearchOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Cài đặt
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 1,
      height: '80px'
    }}>
      {/* Left side - Brand */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1890ff',
          marginRight: '40px'
        }}>
          ShineWay
        </h1>
        
        {/* Search Input */}
        <Input
          prefix={<SearchOutlined style={{ color: '#999' }} />}
          style={{
            width: '300px',
            borderRadius: '8px',
            border: '1px solid #1890ff'
          }}
        />
      </div>
      
      {/* Right side - User profile and actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* User Profile Section */}
        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          >
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: '#0088FF',
                border: '2px solid #fff',
                color: '#fff'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#000',
                lineHeight: '1.2',
                marginBottom: '4px'
              }}>
                {authState.user?.fullName || 'User'}
              </div>
              <span style={{
                backgroundColor: authState.user?.role === 'admin' ? '#ff8c00' : '#1890ff',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                height: '20px'
              }}>
                <HomeOutlined style={{ fontSize: '10px' }} />
                {authState.user?.role === 'admin' ? 'Admin' : 'Bồi bàn'}
              </span>
            </div>
          </div>
        </Dropdown>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '32px',
          backgroundColor: '#e8e8e8'
        }} />

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button 
            type="text" 
            icon={<QuestionCircleOutlined />}
            style={{ 
              fontSize: '16px',
              color: '#8c8c8c',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              boxShadow: 'none'
            }}
          />
          
          <Badge dot color="#ff4d4f" offset={[-2, 2]}>
            <Button 
              type="text" 
              icon={<BellOutlined />}
              style={{ 
                fontSize: '16px',
                color: '#8c8c8c',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                boxShadow: 'none'
              }}
            />
          </Badge>
          
          <Button 
            type="text" 
            icon={<MenuOutlined />}
            style={{ 
              fontSize: '16px',
              color: '#8c8c8c',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              boxShadow: 'none'
            }}
          />
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
