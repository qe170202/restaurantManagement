import React from 'react';
import { Typography } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, LeftOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface OrderHeaderProps {
  onShowPreviousOrders?: () => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ onShowPreviousOrders }) => {
  const [currentTime, setCurrentTime] = React.useState<string>('');
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(timeString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  const now = new Date();
  const dateString = now.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 16
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '12px 16px',
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid #f0f0f0',
        minWidth: 180,
        minHeight: 80,
        textAlign: 'center'
      }}>
        <div style={{ position: 'relative', width: '100%', paddingLeft: 28, minHeight: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CalendarOutlined style={{ color: '#1677ff', fontSize: 18, position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }} />
          <Text>{dateString}</Text>
        </div>
        <div style={{ position: 'relative', width: '100%', paddingLeft: 28, minHeight: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ClockCircleOutlined style={{ color: '#1677ff', fontSize: 18, position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }} />
          <Text>{currentTime}</Text>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onShowPreviousOrders}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onShowPreviousOrders?.();
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px 16px',
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #f0f0f0',
          width: '100%',
          minHeight: 80,
          cursor: onShowPreviousOrders ? 'pointer' as const : 'default' as const,
          userSelect: 'none'
        }}
      >
        <LeftOutlined style={{ color: '#1f1f1f' }} />
        <Text strong>Đơn hàng trước đó</Text>
      </div>
    </div>
  );
};

export default OrderHeader;


