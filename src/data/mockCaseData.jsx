export const MOCK_CASE = {
  id: 'CMP-2026-000001',
  type: 'ATM / CDM Issue',
  customer: 'Imran Qureshi',
  cnic: '42101-1234567-3',
  status: 'Open',
  slaState: 'On Track',
  priority: 'Major',
  lodgedAt: 'Fri 2 Oct, 16:40',
  dueAt: 'Fri 9 Oct, 16:40',
  owner: 'Ayesha Khan',
  currentTeam: 'Card Services',
  fields: {
    product: 'Digital Banking',
    category: 'ATM',
    subCategory: 'Cash not dispensed',
    sbpType: 'ATM / CDM',
    internalType: 'Major',
    atmId: 'ATM-KHI-0457',
    atmLocation: 'Clifton, Karachi',
    transactionDate: '28 Sep 2026',
    amount: '25,000',
    notes: 'Cash not dispensed; account was debited.',
  },
  slaDetails: {
    policy: 'ATM / CDM standard · 5 working days',
    due: 'Fri 9 Oct, 16:40',
    L1: 'Thu 8 Oct, 16:40 · Nadia Hussain',
    L2: 'Fri 9 Oct, 16:40 · Kashif Raza',
    interimSms: 'Tue 13 Oct, if still open'
  },
  timeline: [
    { time: 'Mon 09:15', actor: 'Hina Baig (Digital Alfa)', action: 'responded', detail: 'Not an app issue. ATM-KHI-0457 is on the card switch; Card Services must check the EJ log.', type: 'comment' },
    { time: 'Fri 16:40', actor: 'System', action: 'Auto-routed to Digital (Alfa)', detail: 'Case assigned by workflow rules.', type: 'system' },
    { time: 'Fri 16:40', actor: 'Ayesha Khan', action: 'Lodged complaint', detail: 'SMS sent to customer.', type: 'system' }
  ]
};