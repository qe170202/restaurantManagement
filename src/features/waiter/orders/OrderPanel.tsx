import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

interface OrderPanelProps {
  hasTable: boolean;
  tableName?: string;
  total?: number;
  children?: React.ReactNode;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ hasTable, tableName, children }) => {
  if (!hasTable) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Title level={4} style={{ marginBottom: 8 }}>Đơn hàng</Title>
        <Text type="secondary">Vui lòng chọn bàn để bắt đầu tạo đơn hàng</Text>
        <div style={{ width: '100%', height: '1px', background: '#eee', marginTop: 24 }} />
      </div>
    );
  }

  return (
    <div>
      <Title level={4}>Đơn hàng cho bàn {tableName}</Title>
      {children}
    </div>
  );
};

export default OrderPanel;

 

