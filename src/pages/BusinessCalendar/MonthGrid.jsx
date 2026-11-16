import React from 'react';
import { Popconfirm } from 'antd';
import { isoDay, shortTime } from './calendarHelpers';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MonthGrid({ month, workingDays, dayStart, dayEnd, holidays, onPick, onRemove }) {
  const first = month.startOf('month');
  const blanks = isoDay(first) - 1;
  const days = Array.from({ length: first.daysInMonth() }, (_, i) => first.add(i, 'day'));
  const byDate = new Map(holidays.map((h) => [h.date, h]));

  return (
    <div className="month-grid">
      {WEEKDAYS.map((d) => <span key={d} className="weekday-header">{d}</span>)}
      {Array.from({ length: blanks }, (_, i) => <span key={`b${i}`} className="day-blank" />)}
      
      {days.map((d) => {
        const date = d.format('YYYY-MM-DD');
        const day = d.format('D MMMM');
        const holiday = byDate.get(date);
        const working = workingDays.includes(isoDay(d));
        const label = holiday ? holiday.name : working ? `${shortTime(dayStart)} to ${shortTime(dayEnd)}` : 'Closed';
        
        const isButton = (holiday ? onRemove : onPick) !== undefined;
        const cellClass = `day-cell ${holiday ? 'holiday' : working ? '' : 'closed'} ${isButton ? 'is-button' : ''}`;
        
        const cellContent = (
          <div 
            className={cellClass}
            onClick={() => !holiday && onPick && onPick(date)}
            role={isButton ? 'button' : 'div'}
            aria-label={holiday ? `${day}, ${holiday.name}` : `Add a holiday on ${day}`}
          >
            <span className="day-number">{d.date()}</span>
            <span className="day-label">{label}</span>
          </div>
        );

        if (holiday && onRemove) {
          return (
            <Popconfirm key={date} title={`Remove ${holiday.name}?`} onConfirm={() => onRemove(holiday)} okText="Remove">
              {cellContent}
            </Popconfirm>
          );
        }
        return <div key={date} style={{ display: 'contents' }}>{cellContent}</div>;
      })}
    </div>
  );
}