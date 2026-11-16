import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function SidebarList({ title, actionText, onAction, items, value, onChange }) {
  return (
    <div className="side-list">
      <div className="side-list-header">
        {title}
        <Button type="link" icon={<PlusOutlined />} onClick={onAction} style={{ fontWeight: 600 }}>
          {actionText}
        </Button>
      </div>
      <div className="side-list-items">
        {items.map((item) => (
          <div 
            key={item.key} 
            className={`side-list-item ${value === item.key ? 'active' : ''}`} 
            onClick={() => onChange(item.key)}
          >
            <div className="side-list-title">{item.title}</div>
            <div className="side-list-detail">{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}