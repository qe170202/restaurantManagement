import React from 'react';
import { Button, Input, Typography, Space } from 'antd';
import { LeftOutlined, RightOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { Dish } from '../../../types/tableManagement';
import { getDishesByCategory } from '../../../services/mockTableData';

const { Title, Text } = Typography;

interface MenuSectionProps {
  containerHeight?: number;
  categories: { id: string; name: string }[];
  dishes: Dish[];
  onAddDish: (dish: Dish) => void;
}

export default function MenuSection({
  containerHeight = 400,
  categories,
  dishes,
  onAddDish
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('1');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [filteredDishes, setFilteredDishes] = React.useState<Dish[]>(dishes);

  React.useEffect(() => {
    let list = getDishesByCategory(selectedCategory);
    if (searchTerm) {
      list = list.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredDishes(list);
  }, [selectedCategory, searchTerm, dishes]);

  const onScrollLeft = () => {
    const el = document.getElementById('dishes-scroll');
    if (el) el.scrollBy({ left: -528, behavior: 'smooth' }); // Scroll exactly 4 items width
  };
  const onScrollRight = () => {
    const el = document.getElementById('dishes-scroll');
    if (el) el.scrollBy({ left: 528, behavior: 'smooth' }); // Scroll exactly 4 items width
  };
  const onScroll = (_e: React.UIEvent<HTMLDivElement>) => {};
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget as HTMLDivElement & {
      _dragging?: boolean;
      _startX?: number;
      _scrollLeft?: number;
    };
    container._dragging = true;
    container._startX = e.pageX - container.offsetLeft;
    container._scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget as HTMLDivElement & {
      _dragging?: boolean;
      _startX?: number;
      _scrollLeft?: number;
    };
    if (!container._dragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - (container._startX || 0)) * 2;
    container.scrollLeft = (container._scrollLeft || 0) - walk;
  };
  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget as HTMLDivElement & { _dragging?: boolean };
    container._dragging = false;
    container.style.cursor = 'grab';
    container.style.userSelect = 'auto';
  };
  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => onMouseUp(e);

  return (
    <div style={{ 
      width: '100%',
      height: `${containerHeight}px`,
      background: '#FFFFFF', 
      borderRadius: '16px', 
      overflow: 'hidden'
    }}>
      <div style={{ 
        background: '#5296E5',
        padding: '16px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderRadius: '16px 16px 0 0'
      }}>
        <Title level={4} style={{ color: 'white', margin: 0 }}>
          Danh mục các món
        </Title>
        <Input
          placeholder="Nhập tên món ăn...."
          prefix={<SearchOutlined style={{ color: '#666' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px', borderRadius: '20px', border: 'none' }}
        />
      </div>

      <div style={{ padding: '16px', height: 'calc(100% - 80px)', background: '#FFFFFF' }}>
        <div style={{ marginBottom: '16px' }}>
          <Space wrap>
            {categories.map(category => (
              <Button
                key={category.id}
                type={selectedCategory === category.id ? 'default' : 'default'}
                onClick={() => setSelectedCategory(category.id)}
                style={{ 
                  borderRadius: '20px',
                  backgroundColor: selectedCategory === category.id ? '#5296E5' : 'white',
                  borderColor: '#5296E5',
                  color: selectedCategory === category.id ? 'white' : '#5296E5',
                  border: '1px solid #5296E5'
                }}
              >
                {category.name}
              </Button>
            ))}
          </Space>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Button type="primary" icon={<LeftOutlined />} onClick={onScrollLeft} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1A72DD', borderColor: '#1A72DD', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} />
          <Button type="primary" icon={<RightOutlined />} onClick={onScrollRight} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1A72DD', borderColor: '#1A72DD', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} />
        </div>

        <div style={{ 
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <style>{`#dishes-scroll::-webkit-scrollbar{display:none;}#dishes-scroll{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
          <div 
            id="dishes-scroll"
            style={{ 
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              overflowY: 'hidden',
              padding: '0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              height: '200px',
              alignItems: 'flex-start',
              scrollBehavior: 'smooth',
              cursor: 'grab',
              userSelect: 'none',
              width: '100%'
            }}
            onScroll={onScroll}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            {filteredDishes.map(dish => (
              <div
                key={dish.id}
                style={{
                  minWidth: '140px',
                  maxWidth: '140px',
                  height: '200px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <div style={{ height: '100px', background: `url(https://picsum.photos/200/120?random=${dish.id}) center/cover`, borderRadius: '16px 16px 0 0', flexShrink: 0 }} />
                <div style={{ padding: '12px', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
                  <div style={{ height: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Text strong style={{ fontSize: '14px', color: '#333', display: 'block', lineHeight: '1.2', marginBottom: '4px' }}>{dish.name}</Text>
                    {dish.requirements && (
                      <Text type="secondary" style={{ fontSize: '10px', display: 'block', lineHeight: '1.2' }}>({dish.requirements})</Text>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '32px' }}>
                    <Text strong style={{ color: '#1A72DD', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      VND {dish.price.toLocaleString('vi-VN')}
                    </Text>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => onAddDish(dish)} style={{ width: '24px', height: '24px', borderRadius: '10px', backgroundColor: '#1A72DD', borderColor: '#1A72DD', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.2)', minWidth: '24px', flexShrink: 0, fontSize: '12px', fontWeight: 'bold' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

 

