import React from 'react';
import { Button, Select, Typography } from 'antd';
import type { Table } from '../../../types/tableManagement';

const { Text, Title } = Typography;
const { Option } = Select;

interface TableSelectorProps {
  tables: Table[];
  onSelect: (tableId: string) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ tables, onSelect }) => {
  const safeTables = Array.isArray(tables) ? tables : [];
  const selectedTableName = React.useMemo(
    () => safeTables.find(t => t.status === 'selected')?.name,
    [safeTables]
  );
  const summary = React.useMemo(() => {
    return safeTables.reduce(
      (acc, t) => {
        if (t.status === 'empty') acc.empty += 1;
        else if (t.status === 'occupied') acc.occupied += 1;
        else if (t.status === 'reserved') acc.reserved += 1;
        return acc;
      },
      { empty: 0, occupied: 0, reserved: 0 }
    );
  }, [safeTables]);
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
    <div >
      <div style={{ 
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '20px',
          flexShrink: 0
        }}>
          <div>
            <Title level={3} style={{ margin: 0, color: '#333', textTransform: 'uppercase', lineHeight: 1 }}>
              Chọn bàn
            </Title>
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#595959', fontWeight: 500 }}>Ca:</span>
              <span style={{
                display: 'inline-block',
                background: '#ff8c00',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600
              }}>
                Tối
              </span>
            </div>
          </div>
          <div>
            <Select defaultValue="1" style={{ width: 120 }}>
              <Option value="1">Tầng 1</Option>
            </Select>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Text style={{ fontWeight: 600 }}>
              ĐANG TRỐNG:
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '8px',
                minWidth: '24px',
                height: '24px',
                padding: '0 8px',
                borderRadius: '999px',
                color: '#fff',
                background: '#1890ff',
                fontSize: '12px',
                fontWeight: 700
              }}>{summary.empty}</span>
            </Text>
            <Text style={{ fontWeight: 600 }}>
              ĐANG DÙNG:
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '8px',
                minWidth: '24px',
                height: '24px',
                padding: '0 8px',
                borderRadius: '999px',
                color: '#fff',
                background: '#e0e0e0',
                border: '1px solid #bfbfbf',
                fontSize: '12px',
                fontWeight: 700
              }}>{summary.occupied}</span>
            </Text>
            <Text style={{ fontWeight: 600 }}>
              ĐẶT TRƯỚC:
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '8px',
                minWidth: '24px',
                height: '24px',
                padding: '0 8px',
                borderRadius: '999px',
                color: '#fff',
                background: '#ff4d4f',
                fontSize: '12px',
                fontWeight: 700
              }}>{summary.reserved}</span>
            </Text>
          </div>

          {selectedTableName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                color: '#5B9AEC',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>Đang chọn:</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '28px',
                height: '28px',
                padding: '0 10px',
                borderRadius: '999px',
                background: '#5B9AEC',
                color: '#fff',
                fontWeight: 700,
                fontSize: '12px'
              }}>{selectedTableName}</span>
            </div>
          )}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(8, 1fr)', 
          gap: '8px',
          flex: 1,
          overflow: 'auto',
          alignContent: 'start'
        }}>
          {safeTables.map(table => (
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
              onClick={() => onSelect(table.id)}
            >
              {table.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSelector;

 

