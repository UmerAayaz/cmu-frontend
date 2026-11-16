export const INITIAL_CALENDARS = [
  {
    id: 'cal-1', name: 'CMU (Mon to Fri)', usedBy: 'CMU Project', timeZone: 'Asia/Karachi',
    workingDays: 'mon-fri', dayStart: '09:00', dayEnd: '17:30', ramadanHours: 'reduced', canEdit: true,
    holidays: [{ date: '2026-11-09', name: 'Iqbal Day' }]
  },
  {
    id: 'cal-2', name: 'People Services (Mon to Fri)', usedBy: 'HR', timeZone: 'Asia/Karachi',
    workingDays: 'mon-fri', dayStart: '08:30', dayEnd: '16:30', ramadanHours: 'reduced', canEdit: false,
    holidays: []
  }
];

export const WORKING_DAYS_OPTIONS = [
  { code: 'mon-fri', label: 'Mon to Fri', days: [1, 2, 3, 4, 5] },
  { code: 'mon-sat', label: 'Mon to Sat', days: [1, 2, 3, 4, 5, 6] }
];