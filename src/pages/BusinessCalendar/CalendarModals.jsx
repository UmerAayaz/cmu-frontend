import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

// 1. ADD HOLIDAY MODAL (Jo pehle banaya tha)
export function AddHolidayModal({ open, onCancel, onFinish, calendarName, initialDate }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        date: initialDate ? dayjs(initialDate) : null,
        name: '',
      });
    }
  }, [open, initialDate, form]);

  return (
    <Modal
      title={`Add holiday to ${calendarName}`}
      open={open}
      onCancel={onCancel}
      width={500}
      centered
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={() => {
            form.validateFields().then(values => {
              onFinish(values);
            }).catch(info => console.log('Validate Failed:', info));
          }}
          style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }} 
        >
          Add holiday
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date!' }]}
        >
          <DatePicker 
            style={{ width: '100%', padding: '8px 12px' }} 
            placeholder="Select date"
            format="DD MMM YYYY"
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter holiday name!' }]}
        >
          <Input placeholder="e.g. Iqbal Day" style={{ padding: '8px 12px' }} />
        </Form.Item>
        
        <div style={{ fontSize: '13px', color: '#8c8c8c', marginTop: '-10px', marginBottom: '10px' }}>
          Due dates on this calendar move past it, and the change is logged.
        </div>
      </Form>
    </Modal>
  );
}

// 2. NEW CALENDAR MODAL (Yeh missing tha jiski wajah se error aa raha tha)
export function NewCalendarModal({ open, onCancel, onFinish }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Modal
      title="Create new calendar"
      open={open}
      onCancel={onCancel}
      width={500}
      centered
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={() => {
            form.validateFields().then(values => {
              onFinish(values);
            }).catch(info => console.log('Validate Failed:', info));
          }}
          style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }} 
        >
          Create calendar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
        <Form.Item
          name="name"
          label="Calendar Name"
          rules={[{ required: true, message: 'Please enter calendar name!' }]}
        >
          <Input placeholder="e.g. Branch Operations (Mon to Sat)" style={{ padding: '8px 12px' }} />
        </Form.Item>

        <Form.Item
          name="usedBy"
          label="Used by (Optional)"
        >
          <Input placeholder="e.g. Branch Operations" style={{ padding: '8px 12px' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}