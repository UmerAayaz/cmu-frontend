import React, { useState, useEffect } from 'react';
import { App, Skeleton, Button, Form, ConfigProvider, Empty } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import './BusinessCalendar.css';
import { WORKING_DAYS_OPTIONS } from './mockData'; 
import SidebarList from './SidebarList';
import WorkingHoursPanel from './WorkingHoursPanel';
import MonthGrid from './MonthGrid';
import { AddHolidayModal, NewCalendarModal } from './CalendarModals';

// API imports
import { getCalendars, getHolidays, saveBusinessCalendar, saveHoliday } from './calendarApi';

export default function BusinessCalendar() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  
  const [calendars, setCalendars] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [month, setMonth] = useState(dayjs());

  const formValues = Form.useWatch([], form);

  // 1. INITIAL LOAD (GET APIs)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [calendarsData, holidaysData] = await Promise.all([
        getCalendars(),
        getHolidays()
      ]);

      // Holidays ko calendarId ke hisaab se group karein
      const holidaysByCalendar = {};
      holidaysData.forEach(h => {
        if (!holidaysByCalendar[h.calendarId]) holidaysByCalendar[h.calendarId] = [];
        const formattedDate = h.holidayDate ? h.holidayDate.split('T')[0] : ''; 
        if (formattedDate) {
          holidaysByCalendar[h.calendarId].push({
            id: h.id,
            date: formattedDate,
            name: h.name
          });
        }
      });

      // Data mapping (Backend to Frontend)
      const formattedCalendars = calendarsData.map(c => {
        let workingDays = 'mon-fri';
        if (c.daysId === 2) workingDays = 'mon-sat';
        
        return {
          ...c,
          workingDays: workingDays,
          dayStart: c.workStart ? c.workStart.substring(0, 5) : '09:00',
          dayEnd: c.workEnd ? c.workEnd.substring(0, 5) : '17:00',
          holidays: holidaysByCalendar[c.id] || [],
          canEdit: true,
          usedBy: c.isDefault ? 'Default Calendar' : 'Project Calendar'
        };
      });

      setCalendars(formattedCalendars);
      
      if (formattedCalendars.length > 0) {
        setSelectedId(prev => prev && formattedCalendars.find(c => c.id === prev) ? prev : formattedCalendars[0].id);
      } else {
        setSelectedId(null);
      }

    } catch (error) {
      console.error(error);
      message.error('Failed to load data from server');
    } finally {
      setIsLoading(false);
    }
  };

  const calendar = calendars.find(c => c.id === selectedId);
  const activeWorkingDays = WORKING_DAYS_OPTIONS.find(o => o.code === calendar?.workingDays)?.days || [];

  // 2. POST API: Add Holiday
  const handleAddHoliday = async (values) => {
    try {
      setIsSaving(true);
      const payload = {
        id: 0,
        calendarId: selectedId,
        userId: 1, // Yahan apna actual login user ID dalna
        holidayDate: values.date.toISOString(), // "2026-11-17T12:11:29.602Z"
        name: values.name
      };
      await saveHoliday(payload);
      await fetchData(); 
      message.success('Holiday saved successfully');
      setIsAddHolidayOpen(false);
      setMonth(values.date);
    } catch (error) {
      message.error('Failed to save holiday');
    } finally {
      setIsSaving(false);
    }
  };

  // 3. POST API: Create Calendar
  const handleCreateCalendar = async (values) => {
    try {
      setIsSaving(true);
      const payload = {
        id: 0, 
        name: values.name,
        timeZone: "Asia/Karachi",
        daysId: 1, 
        workStart: "09:00:00", 
        workEnd: "17:00:00",
        isDefault: false,
        userId: 1 // Yahan apna actual login user ID dalna
      };
      await saveBusinessCalendar(payload);
      await fetchData(); 
      message.success('Calendar created successfully');
      setIsNewModalOpen(false);
    } catch (error) {
      message.error('Failed to create calendar');
    } finally {
      setIsSaving(false);
    }
  };

  // 4. POST API: Update Calendar (Save Working Hours)
  const handleSaveWorkingHours = async () => {
    try {
      const values = form.getFieldsValue();
      setIsSaving(true);
      const payload = {
        id: calendar.id,
        name: calendar.name,
        timeZone: calendar.timeZone,
        daysId: values.workingDays === 'mon-fri' ? 1 : 2, 
        workStart: values.dayStart ? `${values.dayStart}:00` : calendar.workStart,
        workEnd: values.dayEnd ? `${values.dayEnd}:00` : calendar.workEnd,
        isDefault: calendar.isDefault || false,
        userId: 1
      };
      await saveBusinessCalendar(payload);
      await fetchData(); 
      message.success('Working hours saved successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to save working hours');
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty = formValues && (
    formValues.dayStart !== calendar?.dayStart || 
    formValues.dayEnd !== calendar?.dayEnd || 
    formValues.workingDays !== calendar?.workingDays 
  );

  // 👇 LOADING SCREEN
  if (isLoading) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: '#dc2626' } }}>
        <div className="calendar-page">
          <div className="page-heading">
            <h1 className="page-title">Business calendar</h1>
          </div>
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </ConfigProvider>
    );
  }

  // 👇 NULL SCREEN (Agar DB mein koi calendar nahi hai)
  if (!calendars || calendars.length === 0 || !calendar) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: '#dc2626' } }}>
        <div className="calendar-page" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <div className="page-heading" style={{ marginBottom: 30 }}>
            <h1 className="page-title">Business calendar</h1>
            <span className="page-desc">Working days, hours and holidays used for every SLA and due date.</span>
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', background: '#fff', padding: '60px 40px', borderRadius: 12, border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: 500 }}>
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={
                  <div>
                    <h3 style={{ fontSize: 18, color: '#333', margin: '10px 0' }}>No Business Calendar Found</h3>
                    <p style={{ color: '#888' }}>Aapke database mein abhi koi calendar nahi hai. Shuru karne ke liye naya calendar banayein.</p>
                  </div>
                }
              >
                <Button 
                  type="primary" 
                  size="large"
                  icon={<PlusOutlined />} 
                  onClick={() => setIsNewModalOpen(true)}
                  style={{ marginTop: 20, padding: '0 30px' }}
                >
                  Create First Calendar
                </Button>
              </Empty>
            </div>
          </div>
        </div>

        <NewCalendarModal 
          open={isNewModalOpen} 
          onCancel={() => setIsNewModalOpen(false)} 
          onFinish={handleCreateCalendar} 
          confirmLoading={isSaving}
        />
      </ConfigProvider>
    );
  }

  // 👇 MAIN UI (Data aane ke baad)
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#dc2626', colorLink: '#dc2626' } }}>
      <div className="calendar-page">
        <div className="stack">
          
          <div className="page-heading">
            <h1 className="page-title">Business calendar</h1>
            <span className="page-desc">Working days, hours and holidays used for every SLA and due date.</span>
          </div>
          
          <div className="split-layout">
            
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

            <div className="split-main">
              <div className="calendar-header-row">
                <h2 className="calendar-title">{calendar.name}</h2>
                <span className="chip">Time zone: {calendar.timeZone}</span>
                <div className="calendar-actions">
                  <Button onClick={() => message.info('Import feature simulated')}>Import holidays</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedDate(null); setIsAddHolidayOpen(true); }}>Add holiday</Button>
                </div>
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
                <div className="panel-header">
                  Holidays 
                  <span className="panel-header-num" style={{ backgroundColor: '#dc2626', color: 'white', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>
                    {calendar.holidays?.length || 0}
                  </span>
                </div>
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
                      holidays={calendar.holidays || []}
                      onPick={(date) => { setSelectedDate(date); setIsAddHolidayOpen(true); }}
                      onRemove={() => message.warning('Delete API not integrated')}
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

        <AddHolidayModal 
          open={isAddHolidayOpen} 
          onCancel={() => setIsAddHolidayOpen(false)} 
          onFinish={handleAddHoliday} 
          calendarName={calendar.name}
          initialDate={selectedDate}
          confirmLoading={isSaving}
        />
        
        <NewCalendarModal 
          open={isNewModalOpen} 
          onCancel={() => setIsNewModalOpen(false)} 
          onFinish={handleCreateCalendar} 
          confirmLoading={isSaving}
        />
      </div>
    </ConfigProvider>
  );
}








import axios from 'axios';

const API_BASE_URL = 'http://localhost:7213/api/BusinessCalendar'; 

export const getCalendars = async () => {
  const response = await axios.get(`${API_BASE_URL}/BusinessCalendarGet`); 
  return response.data?.data || []; 
};

export const getHolidays = async () => {
  const response = await axios.get(`${API_BASE_URL}/HolidayGet`);
  return response.data?.data || []; 
};

export const saveBusinessCalendar = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/BusinessCalendarSave`, data);
  return response.data;
};

export const saveHoliday = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/HolidaySave`, data);
  return response.data;
};































// src/pages/BusinessCalendar/calendarApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:7213/api/BusinessCalendar'; 

// 1. GET: Saare Calendars laane ke liye
export const getCalendars = async () => {
  const response = await axios.get(`${API_BASE_URL}/BusinessCalendarGet`); 
  return response.data.data; // Backend wrapper se array nikala
};

// 2. GET: Saari Holidays laane ke liye
export const getHolidays = async () => {
  const response = await axios.get(`${API_BASE_URL}/HolidayGet`);
  return response.data.data; // Backend wrapper se array nikala
};

// 3. POST: Calendar Save (Naya ya Update)
export const saveBusinessCalendar = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/BusinessCalendarSave`, data);
  return response.data;
};

// 4. POST: Holiday Save
export const saveHoliday = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/HolidaySave`, data);
  return response.data;
};
















import React, { useState, useEffect } from 'react';
import { App, Skeleton, Button, Form, ConfigProvider } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import './BusinessCalendar.css';
import { WORKING_DAYS_OPTIONS } from './mockData'; 
import SidebarList from './SidebarList';
import WorkingHoursPanel from './WorkingHoursPanel';
import MonthGrid from './MonthGrid';
import { AddHolidayModal, NewCalendarModal } from './CalendarModals';

import { getCalendars, getHolidays, saveBusinessCalendar, saveHoliday } from './calendarApi';

export default function BusinessCalendar() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  
  const [calendars, setCalendars] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [month, setMonth] = useState(dayjs());

  const formValues = Form.useWatch([], form);

  // 👇 INITIAL LOAD: Dono GET APIs call karein
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Dono APIs parallel call karein
      const [calendarsData, holidaysData] = await Promise.all([
        getCalendars(),
        getHolidays()
      ]);

      // 1. Holidays ko calendarId ke hisaab se group karein
      const holidaysByCalendar = {};
      holidaysData.forEach(h => {
        if (!holidaysByCalendar[h.calendarId]) holidaysByCalendar[h.calendarId] = [];
        
        // Backend "2026-11-09T00:00:00" bhej raha hai, humein "2026-11-09" chahiye
        const formattedDate = h.holidayDate.split('T')[0]; 
        
        holidaysByCalendar[h.calendarId].push({
          id: h.id,
          date: formattedDate,
          name: h.name
        });
      });

      // 2. Calendars ko frontend format mein map karein
      const formattedCalendars = calendarsData.map(c => {
        // daysId (1 = Mon-Fri, 2 = Mon-Sat) mapping
        let workingDays = 'mon-fri';
        if (c.daysId === 2) workingDays = 'mon-sat';
        if (c.daysId === 3) workingDays = 'all-days';

        return {
          ...c,
          workingDays: workingDays,
          // "09:00:00" ko "09:00" banayein
          dayStart: c.workStart ? c.workStart.substring(0, 5) : '09:00',
          dayEnd: c.workEnd ? c.workEnd.substring(0, 5) : '17:00',
          holidays: holidaysByCalendar[c.id] || [],
          canEdit: true,
          usedBy: c.isDefault ? 'Default Calendar' : 'Project Calendar'
        };
      });

      setCalendars(formattedCalendars);
      if (formattedCalendars.length > 0) {
        setSelectedId(formattedCalendars[0].id);
      }
    } catch (error) {
      message.error('Failed to load data from server');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calendar = calendars.find(c => c.id === selectedId);
  const activeWorkingDays = WORKING_DAYS_OPTIONS.find(o => o.code === calendar?.workingDays)?.days || [];

  if (isLoading) {
    return (
      <div className="calendar-page">
        <div className="page-heading">
          <h1 className="page-title">Business calendar</h1>
        </div>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!calendar) {
    return <div style={{ padding: 40, textAlign: 'center' }}>No calendars found.</div>;
  }

  // 👇 POST API 1: Add Holiday
  const handleAddHoliday = async (values) => {
    try {
      setIsSaving(true);
      
      const payload = {
        id: 0,
        calendarId: selectedId,
        userId: 1, // Replace with actual logged in user ID
        holidayDate: values.date.toISOString(), // "2026-11-17T12:11:29.602Z"
        name: values.name
      };

      await saveHoliday(payload);
      await fetchData(); // Data refresh karein
      
      message.success('Holiday saved successfully');
      setIsAddHolidayOpen(false);
      setMonth(values.date);
    } catch (error) {
      message.error('Failed to save holiday');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveHoliday = (holiday) => {
    message.warning('Delete API not available yet');
  };

  // 👇 POST API 2: Create/Update Calendar
  const handleCreateCalendar = async (values) => {
    try {
      setIsSaving(true);
      
      const payload = {
        id: 0, 
        name: values.name,
        timeZone: "Asia/Karachi",
        daysId: 1, // By default Mon-Fri
        workStart: "09:00:00", // Backend format
        workEnd: "17:00:00",
        isDefault: false,
        userId: 1 
      };

      await saveBusinessCalendar(payload);
      await fetchData(); // Data refresh karein
      
      message.success('Calendar created successfully');
      setIsNewModalOpen(false);
    } catch (error) {
      message.error('Failed to create calendar');
    } finally {
      setIsSaving(false);
    }
  };

  // 👇 POST API 2 (Update): Save Working Hours
  const handleSaveWorkingHours = async () => {
    try {
      const values = form.getFieldsValue();
      setIsSaving(true);

      // Backend format ke hisaab se payload
      const payload = {
        id: calendar.id,
        name: calendar.name,
        timeZone: calendar.timeZone,
        daysId: values.workingDays === 'mon-fri' ? 1 : 2, 
        workStart: values.dayStart ? `${values.dayStart}:00` : calendar.workStart,
        workEnd: values.dayEnd ? `${values.dayEnd}:00` : calendar.workEnd,
        isDefault: calendar.isDefault || false,
        userId: 1
      };

      await saveBusinessCalendar(payload);
      await fetchData(); // Data refresh karein
      
      message.success('Working hours saved successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to save working hours');
    } finally {
      setIsSaving(false);
    }
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
        token: { colorPrimary: '#dc2626', colorLink: '#dc2626' },
      }}
    >
      <div className="calendar-page">
        <div className="stack">
          {/* HEADING */}
          <div className="page-heading">
            <h1 className="page-title">Business calendar</h1>
            <span className="page-desc">Working days, hours and holidays used for every SLA and due date.</span>
          </div>
          
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
                <div className="calendar-actions">
                  <Button onClick={() => message.info('Import feature simulated')}>Import holidays</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedDate(null); setIsAddHolidayOpen(true); }}>Add holiday</Button>
                </div>
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
                <div className="panel-header">
                  Holidays 
                  <span className="panel-header-num" style={{ backgroundColor: '#dc2626', color: 'white', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>
                    {calendar.holidays?.length || 0}
                  </span>
                </div>
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
                      holidays={calendar.holidays || []}
                      onPick={(date) => { setSelectedDate(date); setIsAddHolidayOpen(true); }}
                      onRemove={handleRemoveHoliday}
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
          confirmLoading={isSaving}
        />
        
        <NewCalendarModal 
          open={isNewModalOpen} 
          onCancel={() => setIsNewModalOpen(false)} 
          onFinish={handleCreateCalendar} 
          confirmLoading={isSaving}
        />
      </div>
    </ConfigProvider>
  );
}



















// src/pages/BusinessCalendar/calendarApi.js
import axios from 'axios';

// Apna backend URL yahan dalein (Swagger ke mutabiq)
const API_BASE_URL = 'http://localhost:7213/api/BusinessCalendar'; 

// 1. GET: Saare Calendars laane ke liye
export const getCalendars = async () => {
  const response = await axios.get(`${API_BASE_URL}/GetAll`); 
  return response.data;
};

// 2. GET: Kisi ek Calendar ke Holidays laane ke liye
export const getHolidays = async (calendarId) => {
  const response = await axios.get(`${API_BASE_URL}/Holidays/${calendarId}`);
  return response.data;
};

// 3. POST: Naya Calendar Save karne ke liye
export const saveBusinessCalendar = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/BusinessCalendarSave`, data);
  return response.data;
};

// 4. POST: Naya Holiday Save karne ke liye
export const saveHoliday = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/HolidaySave`, data);
  return response.data;
};










import React, { useState, useEffect } from 'react';
import { App, Skeleton, Button, Form, ConfigProvider } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import './BusinessCalendar.css';
import { WORKING_DAYS_OPTIONS } from './mockData'; // INITIAL_CALENDARS ki zaroorat nahi rahi
import SidebarList from './SidebarList';
import WorkingHoursPanel from './WorkingHoursPanel';
import MonthGrid from './MonthGrid';
import { AddHolidayModal, NewCalendarModal } from './CalendarModals';

// APIs import karein
import { getCalendars, getHolidays, saveBusinessCalendar, saveHoliday } from './calendarApi';

export default function BusinessCalendar() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  
  const [calendars, setCalendars] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [month, setMonth] = useState(dayjs());

  const formValues = Form.useWatch([], form);

  // 👇 1. GET API: Initial Load par data fetch karein
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      // GET API 1: Saare calendars laayein
      const data = await getCalendars();
      
      // Agar backend se data aa jaye toh state set karein
      // Note: Backend ka data structure aapke UI structure se match karna chahiye
      if (data && data.length > 0) {
        setCalendars(data);
        setSelectedId(data[0].id);
        
        // Pehle calendar ki holidays fetch karein
        await fetchHolidaysForCalendar(data[0].id);
      }
    } catch (error) {
      message.error('Failed to load calendars from server');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHolidaysForCalendar = async (calendarId) => {
    try {
      // GET API 2: Selected calendar ki holidays laayein
      const holidays = await getHolidays(calendarId);
      setCalendars(prev => prev.map(c => 
        c.id === calendarId ? { ...c, holidays: holidays } : c
      ));
    } catch (error) {
      console.error("Error fetching holidays", error);
    }
  };

  // Jab sidebar se dusra calendar select ho
  const handleCalendarSelect = async (id) => {
    setSelectedId(id);
    // Har dafa select karne par holidays fetch karein
    await fetchHolidaysForCalendar(id);
  };

  const calendar = calendars.find(c => c.id === selectedId);
  const activeWorkingDays = WORKING_DAYS_OPTIONS.find(o => o.code === calendar?.workingDays)?.days || [];

  if (isLoading) {
    return (
      <div className="calendar-page">
        <div className="page-heading">
          <h1 className="page-title">Business calendar</h1>
          <span className="page-desc">Loading calendars...</span>
        </div>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!calendar) {
    return <div style={{ padding: 40, textAlign: 'center' }}>No calendars found. Please create one.</div>;
  }

  // 👇 2. POST API: Add Holiday
  const handleAddHoliday = async (values) => {
    try {
      setIsSaving(true);
      
      // Backend ke mutabiq payload banayein (Image 1)
      const payload = {
        id: 0,
        calendarId: selectedId,
        userId: 1, // Apne auth context se real User ID dalein
        holidayDate: values.date.toISOString(), // "2026-11-17T12:11:29.602Z" format
        name: values.name
      };

      await saveHoliday(payload);
      
      // API success ke baad UI update karein
      await fetchHolidaysForCalendar(selectedId);
      
      message.success('Holiday saved successfully');
      setIsAddHolidayOpen(false);
      setMonth(values.date);
    } catch (error) {
      message.error('Failed to save holiday');
    } finally {
      setIsSaving(false);
    }
  };

  // Holiday Remove (Backend API delete nahi maangi hai, isliye abhi frontend se remove kar rahe hain)
  const handleRemoveHoliday = (holidayToRemove) => {
    message.warning('Delete API not integrated yet');
  };

  // 👇 3. POST API: Create/Update Calendar
  const handleCreateCalendar = async (values) => {
    try {
      setIsSaving(true);
      
      // Backend ke mutabiq payload (Image 2)
      const payload = {
        id: 0, // 0 for new, ya agar update hai toh calendar.id
        name: values.name,
        timeZone: "Asia/Karachi",
        daysId: 1, // 1 = Mon-Fri (Aapko backend mapping ke mutabiq set karna hoga)
        workStart: "09:00",
        workEnd: "17:00",
        isDefault: false,
        userId: 1
      };

      await saveBusinessCalendar(payload);
      
      // Naya data fetch karein
      await fetchInitialData();
      
      message.success('Calendar created successfully');
      setIsNewModalOpen(false);
    } catch (error) {
      message.error('Failed to create calendar');
    } finally {
      setIsSaving(false);
    }
  };

  // 👇 4. POST API: Save Working Hours (Update)
  const handleSaveWorkingHours = async () => {
    try {
      const values = form.getFieldsValue();
      setIsSaving(true);

      const payload = {
        id: calendar.id, // Update hone par ID bhejna zaroori hai
        name: calendar.name,
        timeZone: calendar.timeZone,
        daysId: values.workingDays === 'mon-fri' ? 1 : 2, // Example mapping
        workStart: values.dayStart,
        workEnd: values.dayEnd,
        isDefault: calendar.isDefault || false,
        userId: 1
      };

      await saveBusinessCalendar(payload);
      await fetchInitialData(); // Refresh data
      
      message.success('Working hours saved');
      form.resetFields();
    } catch (error) {
      message.error('Failed to save working hours');
    } finally {
      setIsSaving(false);
    }
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
        token: { colorPrimary: '#dc2626', colorLink: '#dc2626' },
      }}
    >
      <div className="calendar-page">
        <div className="stack">
          {/* HEADING */}
          <div className="page-heading">
            <h1 className="page-title">Business calendar</h1>
            <span className="page-desc">Working days, hours and holidays used for every SLA and due date.</span>
          </div>
          
          <div className="split-layout">
            {/* SIDEBAR */}
            <div className="split-side">
              <SidebarList
                title="Calendars"
                actionText="New"
                onAction={() => setIsNewModalOpen(true)}
                items={calendars.map((c) => ({ key: c.id, title: c.name, detail: c.usedBy || 'Project' }))}
                value={calendar.id}
                onChange={handleCalendarSelect} // API call wala function pass kiya
              />
            </div>

            {/* MAIN CONTENT */}
            <div className="split-main">
              <div className="calendar-header-row">
                <h2 className="calendar-title">{calendar.name}</h2>
                <span className="chip">Time zone: {calendar.timeZone}</span>
                {calendar.canEdit !== false ? (
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
                <div className="panel-header">Holidays <span className="panel-header-num" style={{ backgroundColor: '#dc2626', color: 'white', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>{calendar.holidays?.length || 0}</span></div>
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
                      dayStart={calendar.dayStart || calendar.workStart || '09:00'}
                      dayEnd={calendar.dayEnd || calendar.workEnd || '17:00'}
                      holidays={calendar.holidays || []}
                      onPick={(date) => { setSelectedDate(date); setIsAddHolidayOpen(true); }}
                      onRemove={handleRemoveHoliday}
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
          confirmLoading={isSaving} // Button par loading spinner dikhane ke liye
        />
        
        <NewCalendarModal 
          open={isNewModalOpen} 
          onCancel={() => setIsNewModalOpen(false)} 
          onFinish={handleCreateCalendar} 
          confirmLoading={isSaving}
        />
      </div>
    </ConfigProvider>
  );
}










/* ═══════════════════════════════════════════════════════════════
   ROLE PERMISSIONS PAGE - RED THEME
   ═══════════════════════════════════════════════════════════════ */

:root {
  /* Fallback theme colors (Agar aapke global CSS mein define nahi hain) */
  --primary-red: #e11d48; /* Crimson Red */
  --primary-red-hover: #be123c;
  --primary-red-bg: rgba(225, 29, 72, 0.08);
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
}

/* ── Page Layout ── */
.role-perm-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-top: 24px;
}

/* ═══════════════════════════════════════════════════════════════
   LEFT SIDEBAR (Role List)
   ═══════════════════════════════════════════════════════════════ */
.role-list-sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Naya Role add karne ka button */
.role-list-sidebar > button:first-child {
  background: var(--card-bg);
  border: 1px dashed var(--primary-red);
  color: var(--primary-red);
  font-weight: 600;
  transition: all 0.2s ease;
  padding: 12px;
  border-radius: 10px;
}

.role-list-sidebar > button:first-child:hover {
  background: var(--primary-red-bg);
  border-style: solid;
  transform: translateY(-1px);
}

/* Role Card */
.role-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.role-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* Active Role Card */
.role-card.active {
  border-color: var(--primary-red);
  background: var(--primary-red-bg);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.1);
}

.role-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.role-card.active .role-icon-box {
  background: var(--primary-red);
  color: #fff;
  box-shadow: 0 2px 8px rgba(225, 29, 72, 0.3);
}

.role-info {
  flex: 1;
}

.role-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
}

.role-card.active .role-name {
  color: var(--primary-red);
}

.role-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* ═══════════════════════════════════════════════════════════════
   RIGHT PANEL (Permissions)
   ═══════════════════════════════════════════════════════════════ */
.perm-panel {
  flex: 1;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

/* Panel Header */
.perm-panel-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #ffffff, #f8fafc);
}

.perm-panel-header-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.perm-shield-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-red-bg);
  color: var(--primary-red);
  display: flex;
  align-items: center;
  justify-content: center;
}

.perm-role-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
}

.perm-role-desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.perm-count-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.perm-count-badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-red);
  box-shadow: 0 0 0 3px var(--primary-red-bg);
}

/* ── Groups Container ── */
.perm-groups-container {
  padding: 24px;
  background: var(--bg-color);
  max-height: calc(100vh - 250px);
  overflow-y: auto;
}

.perm-group {
  margin-bottom: 32px;
}

.perm-group:last-child {
  margin-bottom: 0;
}

/* Group Header */
.perm-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.perm-group-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.perm-category-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid transparent;
}

.perm-group-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.perm-toggle-all-btn {
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.perm-toggle-all-btn:hover {
  background: #e2e8f0;
  color: var(--text-main);
}

.perm-toggle-all-btn.active {
  color: var(--primary-red);
}

/* ── Grid Layout for Permissions ── */
.perm-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* ── Individual Permission Card ── */
.perm-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.perm-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.perm-card.enabled {
  border-color: var(--primary-red);
  background: #fffafb;
  box-shadow: 0 2px 10px rgba(225, 29, 72, 0.05);
}

.perm-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.perm-card.enabled .perm-icon-box {
  background: var(--primary-red-bg);
  color: var(--primary-red);
}

.perm-text {
  flex: 1;
}

.perm-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 4px;
}

.perm-card.enabled .perm-label {
  color: var(--primary-red);
}

.perm-description {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

/* ── Custom Toggle Switch ── */
.toggle-switch {
  width: 44px;
  height: 24px;
  background: #e2e8f0;
  border-radius: 12px;
  border: none;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  padding: 0;
  margin-top: 6px;
}

.toggle-switch.enabled {
  background: var(--primary-red);
}

.toggle-dot {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.toggle-switch.enabled .toggle-dot {
  transform: translateX(20px);
}

/* ── Sticky Footer ── */
.perm-footer {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.perm-footer-text {
  font-size: 13px;
  color: var(--text-muted);
}

/* ═══════════════════════════════════════════════════════════════
   MODAL & ANT DESIGN CUSTOMIZATION
   ═══════════════════════════════════════════════════════════════ */

/* Antd Modal Header */
.ant-modal-header {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.ant-modal-title {
  font-weight: 700 !important;
  font-size: 18px !important;
  color: var(--text-main) !important;
}

/* Antd Checkbox Customization (Red Theme) */
.ant-checkbox-wrapper {
  transition: all 0.2s;
}

.ant-checkbox-wrapper:hover .ant-checkbox-inner {
  border-color: var(--primary-red) !important;
}

.ant-checkbox-checked .ant-checkbox-inner {
  background-color: var(--primary-red) !important;
  border-color: var(--primary-red) !important;
}

.ant-checkbox-checked::after {
  border-color: var(--primary-red) !important;
}

/* Scrollbar customization for groups container */
.perm-groups-container::-webkit-scrollbar,
.ant-modal-body > div > div::-webkit-scrollbar {
  width: 6px;
}

.perm-groups-container::-webkit-scrollbar-track,
.ant-modal-body > div > div::-webkit-scrollbar-track {
  background: transparent;
}

.perm-groups-container::-webkit-scrollbar-thumb,
.ant-modal-body > div > div::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.perm-groups-container::-webkit-scrollbar-thumb:hover,
.ant-modal-body > div > div::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* ── Responsive Design ── */
@media (max-width: 1024px) {
  .perm-grid {
    grid-template-columns: 1fr; /* 1 column on smaller screens */
  }
}

@media (max-width: 768px) {
  .role-perm-layout {
    flex-direction: column;
  }
  
  .role-list-sidebar {
    width: 100%;
  }
  
  .perm-panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}







// Saari available permissions ki list
export const ALL_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'forms', label: 'Forms' },
  { key: 'workflows', label: 'Workflows' },
  { key: 'fieldLibrary', label: 'Field Library' },
  { key: 'teamSetup', label: 'Team Setup' },
  { key: 'myCases', label: 'My Cases' },
  { key: 'caseQueue', label: 'Case Queue' },
  { key: 'publishQueue', label: 'Publish Queue' },
  { key: 'lodgeComplaint', label: 'Lodge Complaint' },
  { key: 'complaintSetup', label: 'Complaint Setup' },
  { key: 'lookups', label: 'Lookups' },
  { key: 'businessCalendar', label: 'Business Calendar' },
  { key: 'myTeam', label: 'My Team' },
  { key: 'reportBuilder', label: 'Report Builder' },
  { key: 'reports', label: 'Reports' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'rcaSetup', label: 'RCA Setup' },
];

// Default Roles aur unki permissions
const DEFAULT_PERMISSIONS = {
  'Super Admin': ALL_PERMISSIONS.map(p => p.key), // Gets all
  'System Admin': ALL_PERMISSIONS.map(p => p.key), // Gets all
  'Team Lead': [
    'dashboard', 'forms', 'workflows', 'teamSetup', 
    'myCases', 'caseQueue', 'businessCalendar', 'myTeam', 'reports'
  ],
  'Case Officer': [
    'dashboard', 'myCases', 'caseQueue', 'lodgeComplaint', 'businessCalendar'
  ],
  'Stakeholder': [
    'dashboard', 'myCases', 'lodgeComplaint'
  ],
  'Reporter': [
    'dashboard', 'lodgeComplaint', 'reports'
  ],
  'Complaint Lodger': [
    'dashboard', 'lodgeComplaint'
  ]
};

// LocalStorage se permissions uthana (ya default return karna)
export function getPermissions() {
  const saved = localStorage.getItem('cmu_permissions');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse permissions", e);
    }
  }
  return DEFAULT_PERMISSIONS;
}

// Permissions ko LocalStorage mein save karna
export function savePermissions(permissions) {
  localStorage.setItem('cmu_permissions', JSON.stringify(permissions));
}










import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, ShieldCheck, FileText, GitBranch, Library, Users, 
  Briefcase, Activity, Send, FilePlus, Settings, Tag, BarChart2, Bell, Info, Layout,
  Calendar, Plus, Trash2
} from 'lucide-react';
import { Modal, Input, Checkbox } from 'antd';
import toast from 'react-hot-toast';
// Agar permissions.js alag folder mein hai toh path adjust karein (e.g. '../utils/permissions')
import { ALL_PERMISSIONS, getPermissions, savePermissions } from "./permissions"; 
import './RolePermissions.css';

const PERMISSION_META = {
  dashboard:        { icon: <Layout size={18} />,      category: 'General',    description: 'View project dashboard and stats' },
  forms:            { icon: <FileText size={18} />,    category: 'Builder',    description: 'Create and edit forms' },
  workflows:        { icon: <GitBranch size={18} />,   category: 'Builder',    description: 'Design workflow processes' },
  fieldLibrary:     { icon: <Library size={18} />,     category: 'Builder',    description: 'Manage reusable form fields' },
  teamSetup:        { icon: <Users size={18} />,       category: 'Operations', description: 'Configure teams and members' },
  myCases:          { icon: <Briefcase size={18} />,   category: 'Operations', description: 'Access own case history' },
  caseQueue:        { icon: <Activity size={18} />,    category: 'Operations', description: 'View shared case queue' },
  publishQueue:     { icon: <Send size={18} />,        category: 'Operations', description: 'Publish forms and workflows' },
  lodgeComplaint:   { icon: <FilePlus size={18} />,    category: 'Management', description: 'Register new complaints' },
  complaintSetup:   { icon: <Settings size={18} />,    category: 'Management', description: 'Configure complaint categories' },
  lookups:          { icon: <Tag size={18} />,         category: 'Management', description: 'Manage master data lists' },
  businessCalendar: { icon: <Calendar size={18} />,    category: 'Management', description: 'Configure business calendars and holidays' },
  myTeam:           { icon: <Users size={18} />,       category: 'Management', description: 'View own team details' },
  reportBuilder:    { icon: <BarChart2 size={18} />,   category: 'Management', description: 'Build custom reports' },
  reports:          { icon: <BarChart2 size={18} />,   category: 'Management', description: 'View and export reports' },
  notifications:    { icon: <Bell size={18} />,        category: 'Management', description: 'Manage notification templates' },
  rcaSetup:         { icon: <Info size={18} />,        category: 'Management', description: 'Configure root cause reasons' },
};

const CATEGORY_COLORS = {
  General:    { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
  Builder:    { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
  Operations: { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
  Management: { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
};

export default function RolePermissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({});
  const [activeRole, setActiveRole] = useState('Super Admin');
  
  // Modal States
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState(['dashboard']); 

  useEffect(() => {
    const data = getPermissions();
    setPermissions(data);
    // Set default active role to first available role
    const availableRoles = Object.keys(data);
    if (availableRoles.length > 0 && !availableRoles.includes(activeRole)) {
      setActiveRole(availableRoles[0]);
    }
  }, []);

  // Dynamic Roles List
  const availableRoles = Object.keys(permissions);
  const rolePerms = permissions[activeRole] || [];

  const handleToggle = (permKey) => {
    const has = rolePerms.includes(permKey);
    setPermissions((prev) => ({
      ...prev,
      [activeRole]: has ? rolePerms.filter(k => k !== permKey) : [...rolePerms, permKey],
    }));
  };

  const handleToggleAll = (category, enable) => {
    const categoryPerms = ALL_PERMISSIONS
      .filter(p => PERMISSION_META[p.key]?.category === category)
      .map(p => p.key);
    
    const newPerms = enable
      ? [...new Set([...rolePerms, ...categoryPerms])]
      : rolePerms.filter(k => !categoryPerms.includes(k));
    
    setPermissions(prev => ({ ...prev, [activeRole]: newPerms }));
  };

  const handleSave = () => {
    savePermissions(permissions);
    toast.success('Permissions saved successfully!');
  };

  // Modal Checkbox Toggle
  const handleModalPermissionToggle = (permKey) => {
    setNewRolePermissions(prev => 
      prev.includes(permKey) ? prev.filter(k => k !== permKey) : [...prev, permKey]
    );
  };

  // Naya Role Create karna
  const handleAddRole = () => {
    const trimmedName = newRoleName.trim();
    if (!trimmedName) return toast.error('Role name is required');
    if (permissions[trimmedName]) return toast.error('Role already exists');

    setPermissions(prev => ({
      ...prev,
      [trimmedName]: newRolePermissions 
    }));
    
    setActiveRole(trimmedName); 
    setIsAddRoleModalOpen(false);
    setNewRoleName('');
    setNewRolePermissions(['dashboard']); 
    toast.success('New role added. Click "Save Permissions" to apply.');
  };

  // Role Delete karna
  const handleDeleteRole = (roleToDelete, e) => {
    e.stopPropagation(); 
    if (roleToDelete === 'Super Admin') return toast.error('Cannot delete Super Admin');
    
    Modal.confirm({
      title: `Delete role "${roleToDelete}"?`,
      content: 'This action cannot be undone.',
      okText: 'Yes, delete',
      okType: 'danger',
      onOk: () => {
        const newPerms = { ...permissions };
        delete newPerms[roleToDelete];
        setPermissions(newPerms);
        if (activeRole === roleToDelete) {
          setActiveRole(Object.keys(newPerms)[0] || 'Super Admin');
        }
        toast.success('Role deleted');
      }
    });
  };

  const categories = ['General', 'Builder', 'Operations', 'Management'];
  const groupedPerms = categories.map(cat => ({
    name: cat,
    perms: ALL_PERMISSIONS.filter(p => PERMISSION_META[p.key]?.category === cat)
  }));

  const totalSelected = rolePerms.length;

  return (
    <div className="wf-page">
      {/* Page Header */}
      <div className="wf-header">
        <div>
          <button onClick={() => navigate(`/projects/${id}/dashboard`)} className="wf-btn wf-btn--ghost wf-btn-back">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="wf-title">Role Permissions</h1>
          <p className="wf-subtitle">Control which features each role can access</p>
        </div>
      </div>

      <div className="role-perm-layout">
        
        {/* LEFT: Role List */}
        <div className="role-list-sidebar">
          
          <button 
            onClick={() => {
              setNewRoleName('');
              setNewRolePermissions(['dashboard']); 
              setIsAddRoleModalOpen(true);
            }}
            className="wf-btn wf-btn--secondary" 
            style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Add New Role
          </button>

          {availableRoles.map((role) => {
            const isActive = activeRole === role;
            const permsCount = (permissions[role] || []).length;
            return (
              <div
                key={role}
                onClick={() => setActiveRole(role)}
                className={`role-card ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="role-icon-box">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="role-info">
                    <div className="role-name">{role}</div>
                    <div className="role-desc">
                      {permsCount} of {ALL_PERMISSIONS.length} permissions
                    </div>
                  </div>
                </div>
                
                {role !== 'Super Admin' && (
                  <button 
                    onClick={(e) => handleDeleteRole(role, e)}
                    style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px' }}
                    title="Delete Role"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: Permissions Panel */}
        <div className="wf-card perm-panel">
          <div className="perm-panel-header">
            <div className="perm-panel-header-inner">
              <div className="perm-shield-icon">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="perm-role-title">{activeRole}</h2>
                <p className="perm-role-desc">Manage permissions for this role</p>
              </div>
            </div>
            <div className="perm-count-badge">
              <span className="dot" />
              {totalSelected} of {ALL_PERMISSIONS.length} enabled
            </div>
          </div>

          <div className="perm-groups-container">
            {groupedPerms.map((group) => {
              if (group.perms.length === 0) return null;
              const meta = CATEGORY_COLORS[group.name] || CATEGORY_COLORS['General'];
              const allEnabled = group.perms.every(p => rolePerms.includes(p.key));
              const someEnabled = group.perms.some(p => rolePerms.includes(p.key));

              return (
                <div key={group.name} className="perm-group">
                  <div className="perm-group-header">
                    <div className="perm-group-title">
                      <span className="perm-category-badge" style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}>
                        {group.name}
                      </span>
                      <span className="perm-group-count">
                        {group.perms.filter(p => rolePerms.includes(p.key)).length}/{group.perms.length}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleAll(group.name, !allEnabled)}
                      className={`perm-toggle-all-btn ${someEnabled || allEnabled ? 'active' : ''}`}
                    >
                      {allEnabled ? 'Disable all' : 'Enable all'}
                    </button>
                  </div>

                  <div className="perm-grid">
                    {group.perms.map((perm) => {
                      const enabled = rolePerms.includes(perm.key);
                      const pmeta = PERMISSION_META[perm.key];
                      return (
                        <div key={perm.key} onClick={() => handleToggle(perm.key)} className={`perm-card ${enabled ? 'enabled' : ''}`}>
                          <div className="perm-icon-box">{pmeta?.icon}</div>
                          <div className="perm-text">
                            <div className="perm-label">{perm.label}</div>
                            <div className="perm-description">{pmeta?.description}</div>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleToggle(perm.key); }} className={`toggle-switch ${enabled ? 'enabled' : ''}`}>
                            <span className="toggle-dot" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="perm-footer">
            <div className="perm-footer-text">Changes apply immediately after saving</div>
            <button onClick={handleSave} className="wf-btn wf-btn--primary">
              <Save size={16} /> Save Permissions
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ ADD ROLE MODAL WITH PERMISSIONS ⭐ */}
      <Modal 
        title="Add New Role & Permissions" 
        open={isAddRoleModalOpen} 
        onCancel={() => setIsAddRoleModalOpen(false)}
        onOk={handleAddRole}
        okText="Create Role"
        width={800}
        okButtonProps={{ style: { backgroundColor: 'var(--primary-red)' } }}
      >
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Role Name Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
              Role Name <span style={{ color: 'red' }}>*</span>
            </label>
            <Input 
              placeholder="e.g. Regional Manager" 
              value={newRoleName} 
              onChange={(e) => setNewRoleName(e.target.value)}
              onPressEnter={handleAddRole}
              autoFocus
              size="large"
            />
          </div>

          {/* Permissions Checkboxes */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
              Select Permissions
            </label>
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '16px' }}>
              {groupedPerms.map(group => (
                <div key={group.name} style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                    {group.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {group.perms.map(perm => (
                      <Checkbox 
                        key={perm.key} 
                        checked={newRolePermissions.includes(perm.key)}
                        onChange={() => handleModalPermissionToggle(perm.key)}
                        style={{ fontSize: '14px', color: '#334155' }}
                      >
                        {perm.label}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Modal>
    </div>
  );
}
