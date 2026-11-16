import React, { useState, useEffect } from 'react';
import { App, Skeleton, Button, Form, ConfigProvider } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import './BusinessCalendar.css';
import { INITIAL_CALENDARS, WORKING_DAYS_OPTIONS } from './mockData';
import SidebarList from './SidebarList';
import WorkingHoursPanel from './WorkingHoursPanel';
import MonthGrid from './MonthGrid';
import { AddHolidayModal, NewCalendarModal } from './CalendarModals';

// LocalStorage ki key
const STORAGE_KEY = 'cmu_business_calendars_data';

export default function BusinessCalendar() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  
  const [calendars, setCalendars] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [month, setMonth] = useState(dayjs());

  const formValues = Form.useWatch([], form);

  // 👇 1. INITIAL LOAD: LocalStorage check karein
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCalendars(parsed);
      setSelectedId(parsed[0]?.id || null);
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setCalendars(INITIAL_CALENDARS);
        setSelectedId(INITIAL_CALENDARS[0].id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CALENDARS));
        setIsLoading(false);
      }, 300);
    }
  }, []);

  const calendar = calendars.find(c => c.id === selectedId);
  const activeWorkingDays = WORKING_DAYS_OPTIONS.find(o => o.code === calendar?.workingDays)?.days || [];

  // 👇 2. Helper Function: State aur LocalStorage dono update karega
  const updateCalendars = (newCalendars) => {
    setCalendars(newCalendars);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCalendars));
  };

  if (isLoading || !calendar) {
    return (
      <div className="calendar-page">
        <div className="page-heading">
          <h1 className="page-title">Business calendar</h1>
          <span className="page-desc">Working days, hours and holidays used for every SLA and due date.</span>
        </div>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  // 👇 3. Holiday Add (Save to LocalStorage)
  const handleAddHoliday = (values) => {
    const newHoliday = { date: values.date.format('YYYY-MM-DD'), name: values.name };
    const updated = calendars.map(c => 
      c.id === selectedId ? { ...c, holidays: [...c.holidays, newHoliday] } : c
    );
    updateCalendars(updated);
    message.success('Holiday added');
    setIsAddHolidayOpen(false);
    setMonth(values.date);
  };

  // 👇 4. Holiday Remove (Save to LocalStorage)
  const handleRemoveHoliday = (holidayToRemove) => {
    const updated = calendars.map(c => 
      c.id === selectedId ? { ...c, holidays: c.holidays.filter(h => h.date !== holidayToRemove.date) } : c
    );
    updateCalendars(updated);
    message.success('Holiday removed');
  };

  // 👇 5. Create Calendar (Save to LocalStorage)
  const handleCreateCalendar = (values) => {
    const newCal = {
      id: `cal-${Date.now()}`, name: values.name, usedBy: values.usedBy || 'My Project',
      timeZone: 'Asia/Karachi', workingDays: 'mon-fri', dayStart: '09:00', dayEnd: '17:00', 
      ramadanHours: 'reduced', canEdit: true, holidays: []
    };
    const updated = [...calendars, newCal];
    updateCalendars(updated);
    setSelectedId(newCal.id);
    message.success('Calendar created');
    setIsNewModalOpen(false);
  };

  // 👇 6. Save Working Hours (Ab yeh actual data save karega)
  const handleSaveWorkingHours = () => {
    const values = form.getFieldsValue();
    
    const updated = calendars.map(c => 
      c.id === selectedId ? { 
        ...c, 
        dayStart: values.dayStart || c.dayStart,
        dayEnd: values.dayEnd || c.dayEnd,
        workingDays: values.workingDays || c.workingDays,
        ramadanHours: values.ramadanHours || c.ramadanHours
      } : c
    );
    
    updateCalendars(updated);
    message.success('Working hours saved');
  };

  const isDirty = formValues && (
    formValues.dayStart !== calendar.dayStart || 
    formValues.dayEnd !== calendar.dayEnd || 
    formValues.workingDays !== calendar.workingDays ||
    formValues.ramadanHours !== calendar.ramadanHours
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#dc2626', 
          colorLink: '#dc2626',    
        },
      }}
    >
      <div className="calendar-page">
        <div className="stack">
          
          {/* HEADING */}
          <div className="page-heading">
            <h1 className="page-title">Business calendar</h1>
            <span className="page-desc">Working days, hours and holidays used for every SLA and due date.</span>
          </div>
          
          {/* MAIN LAYOUT */}
          <div className="split-layout">
            
            {/* SIDEBAR */}
            <div className="split-side">
              <SidebarList
                title="Calendars"
                actionText="New"
                onAction={() => setIsNewModalOpen(true)}
                items={calendars.map((c) => ({ key: c.id, title: c.name, detail: c.usedBy }))}
                value={calendar.id}
                onChange={setSelectedId}
              />
            </div>

            {/* MAIN CONTENT */}
            <div className="split-main">
              
              <div className="calendar-header-row">
                <h2 className="calendar-title">{calendar.name}</h2>
                <span className="chip">Time zone: {calendar.timeZone}</span>
                {calendar.canEdit ? (
                  <div className="calendar-actions">
                    <Button onClick={() => message.info('Import feature simulated')}>Import holidays</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedDate(null); setIsAddHolidayOpen(true); }}>Add holiday</Button>
                  </div>
                ) : (
                  <span className="read-only-text">Read only: this calendar belongs to another project.</span>
                )}
              </div>

              <WorkingHoursPanel 
                calendar={calendar} 
                workingDaysOptions={WORKING_DAYS_OPTIONS} 
                isDirty={isDirty}
                onSave={handleSaveWorkingHours}
                onCancel={() => form.resetFields()}
                form={form}
              />

              <div className="panel">
                <div className="panel-header">Holidays <span className="panel-header-num" style={{ backgroundColor: '#dc2626', color: 'white', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>2</span></div>
                <div className="panel-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="month-nav">
                      <Button type="link" onClick={() => setMonth(month.subtract(1, 'month'))} style={{ fontWeight: 600 }}>Previous</Button>
                      <span className="month-title">{month.format('MMMM YYYY')}</span>
                      <Button type="link" onClick={() => setMonth(month.add(1, 'month'))} style={{ fontWeight: 600 }}>Next</Button>
                    </div>
                    <MonthGrid
                      month={month}
                      workingDays={activeWorkingDays}
                      dayStart={calendar.dayStart}
                      dayEnd={calendar.dayEnd}
                      holidays={calendar.holidays}
                      onPick={calendar.canEdit ? (date) => { setSelectedDate(date); setIsAddHolidayOpen(true); } : undefined}
                      onRemove={calendar.canEdit ? handleRemoveHoliday : undefined}
                    />
                  </div>
                </div>
              </div>

              <div className="note-box">
                SLA clocks count only working time on this calendar. Due dates move when a holiday is added, and the change is logged.
              </div>

            </div>
          </div>
        </div>

        {/* MODALS */}
        <AddHolidayModal 
          open={isAddHolidayOpen} 
          onCancel={() => setIsAddHolidayOpen(false)} 
          onFinish={handleAddHoliday} 
          calendarName={calendar.name}
          initialDate={selectedDate}
        />
        
        <NewCalendarModal 
          open={isNewModalOpen} 
          onCancel={() => setIsNewModalOpen(false)} 
          onFinish={handleCreateCalendar} 
        />
      </div>
    </ConfigProvider>
  );
}