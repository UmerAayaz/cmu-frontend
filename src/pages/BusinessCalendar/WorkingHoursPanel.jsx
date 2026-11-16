import React from 'react';
import { Button, Form, Input, Select } from 'antd';

export default function WorkingHoursPanel({ calendar, workingDaysOptions, isDirty, onSave, onCancel, form }) {
  return (
    <div className="panel">
      <div className="panel-header">Working hours <span className="panel-header-num">1</span></div>
      <div className="panel-body">
        <Form 
          form={form} 
          layout="vertical" 
          requiredMark={false} 
          disabled={!calendar.canEdit}
          initialValues={{ 
            dayStart: calendar.dayStart, 
            dayEnd: calendar.dayEnd, 
            workingDays: calendar.workingDays, 
            ramadanHours: calendar.ramadanHours 
          }}
        >
          <div className="columns-grid">
            <Form.Item name="dayStart" label="Day starts">
              <Input style={{ fontFamily: 'var(--font-mono)' }} maxLength={5} />
            </Form.Item>
            <Form.Item name="dayEnd" label="Day ends">
              <Input style={{ fontFamily: 'var(--font-mono)' }} maxLength={5} />
            </Form.Item>
            <Form.Item name="workingDays" label="Working days">
              <Select options={workingDaysOptions.map(o => ({ value: o.code, label: o.label }))} />
            </Form.Item>
            <Form.Item name="ramadanHours" label="Ramadan hours">
              <Select options={[{ value: 'reduced', label: 'Reduced Hours' }, { value: 'normal', label: 'Normal' }]} />
            </Form.Item>
          </div>
          {isDirty && (
            <div className="form-actions">
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" onClick={onSave}>Save</Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}