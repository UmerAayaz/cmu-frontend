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
        userId: 1 
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

  const handleAddHoliday = async (values) => {
    try {
      setIsSaving(true);
      const payload = {
        id: 0,
        calendarId: selectedId,
        userId: 1, 
        holidayDate: values.date.toISOString(), 
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

  if (isLoading) {
    return (
      <div className="calendar-page">
        <div className="page-heading">
          <h1 className="page-title">Business calendar</h1>
          <span className="page-desc">Loading from server...</span>
        </div>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#dc2626', colorLink: '#dc2626' } }}>
      <div className="calendar-page">
        <div className="stack">
          
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
                value={calendar?.id}
                onChange={setSelectedId}
              />
            </div>

            {/* MAIN CONTENT */}
            <div className="split-main">
              
              {!calendar ? (
                <div style={{ padding: '40px', textAlign: 'center', background: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: 8, color: '#888' }}>
                  <p style={{ fontSize: 16 }}>No calendars available.</p>
                  <p>Click on the <b>"+ New"</b> button on the left to create one.</p>
                </div>
              ) : (
                <>
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
                          onPick={calendar.canEdit ? (date) => { setSelectedDate(date); setIsAddHolidayOpen(true); } : undefined}
                          onRemove={() => message.warning('Delete API not integrated yet')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="note-box">
                    SLA clocks count only working time on this calendar. Due dates move when a holiday is added, and the change is logged.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <NewCalendarModal 
          open={isNewModalOpen} 
          onCancel={() => setIsNewModalOpen(false)} 
          onFinish={handleCreateCalendar} 
          confirmLoading={isSaving}
        />

        {calendar && (
          <AddHolidayModal 
            open={isAddHolidayOpen} 
            onCancel={() => setIsAddHolidayOpen(false)} 
            onFinish={handleAddHoliday} 
            calendarName={calendar.name}
            initialDate={selectedDate}
            confirmLoading={isSaving}
          />
        )}
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
