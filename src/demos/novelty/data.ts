export type Message = { id: string; from: string; subject: string };

const LINES: [string, string][] = [
  ['Ferry Line', 'Your Monday crossing is confirmed'],
  ['Mia Chen', 'Notes from Thursday'],
  ['Northwind Bank', 'Your statement is ready'],
  ['Leo Park', 'Lunch next week?'],
  ['Design Weekly', 'Issue 212: grids that breathe'],
  ['Calendar', 'Reminder: review at 10:00'],
  ['Ana Silva', 'Re: draft for the launch post'],
  ['Parcel Point', 'Delivered to your locker'],
  ['Jonah Reed', 'Photos from the trip'],
  ['Payroll', 'October payslip'],
  ['Studio Rent', 'Invoice 0419'],
  ['Kai Ito', 'Quick question about the deck'],
  ['Library', 'Two books due Friday'],
  ['Mia Chen', 'Re: Notes from Thursday'],
  ['Cloud Drive', 'Storage almost full'],
  ['Priya Nair', 'Feedback on the onboarding flow'],
  ['Gym', 'Your class was moved to 7:30'],
  ['Tax Office', 'Your return was received'],
  ['Leo Park', 'Re: Lunch next week?'],
  ['Airline', 'Check in for your flight'],
  ['Ana Silva', 'Final copy attached'],
  ['Newsletter', 'Five links for the weekend'],
  ['Electric Co.', 'Meter reading due'],
  ['Sam Ortiz', 'Can you cover Tuesday?'],
  ['Hiring', 'Two new applications'],
  ['Kai Ito', 'Re: Quick question about the deck'],
  ['Bookshop', 'Your order has shipped'],
  ['School', 'Parents’ evening sign-up'],
  ['Jonah Reed', 'Re: Photos from the trip'],
  ['Mia Chen', 'Agenda for Monday'],
];

/** Thirty messages to archive, one after another. */
export const INBOX: Message[] = LINES.map(([from, subject], i) => ({ id: `m${i}`, from, subject }));

/** A day's tasks, to tick off one by one. */
export const TASKS = [
  'Reply to Mia',
  'Book the ferry',
  'Send the invoice',
  'Review the deck',
  'Water the plants',
  'Pay the electric bill',
  'Pick up the parcel',
  'Plan Monday’s agenda',
];
