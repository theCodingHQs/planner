// Calendar date math and holiday utilities
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAYS_SUNDAY = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
export const WEEKDAYS_MONDAY = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const WEEKDAYS_SHORT_SUN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const WEEKDAYS_SHORT_MON = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function getFirstDayOfWeek(year, monthIndex, startOfWeek = 0) {
  // startOfWeek: 0 = Sunday, 1 = Monday
  const day = new Date(year, monthIndex, 1).getDay();
  if (startOfWeek === 1) {
    return (day + 6) % 7; // Convert 0 (Sun) -> 6, 1 (Mon) -> 0
  }
  return day;
}

export function generateCalendarGrid(year, monthIndex, startOfWeek = 0) {
  const daysInCurrentMonth = getDaysInMonth(year, monthIndex);
  const startDayOffset = getFirstDayOfWeek(year, monthIndex, startOfWeek);
  
  // Previous month details
  const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
  const prevYear = monthIndex === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);
  
  const cells = [];
  
  // 1. Leading empty/prev month cells
  for (let i = startDayOffset - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    cells.push({
      dayNumber: dayNum,
      isCurrentMonth: false,
      isLeading: true,
      year: prevYear,
      month: prevMonthIndex,
      dateKey: `${prevYear}-${String(prevMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    });
  }
  
  // 2. Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    cells.push({
      dayNumber: d,
      isCurrentMonth: true,
      isLeading: false,
      year,
      month: monthIndex,
      dateKey: `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }
  
  // 3. Trailing cells to fill 5 or 6 rows (multiples of 7)
  const totalCellsNeeded = cells.length > 35 ? 42 : 35;
  const nextMonthIndex = monthIndex === 11 ? 0 : monthIndex + 1;
  const nextYear = monthIndex === 11 ? year + 1 : year;
  
  let nextDayNum = 1;
  while (cells.length < totalCellsNeeded) {
    cells.push({
      dayNumber: nextDayNum,
      isCurrentMonth: false,
      isTrailing: true,
      year: nextYear,
      month: nextMonthIndex,
      dateKey: `${nextYear}-${String(nextMonthIndex + 1).padStart(2, '0')}-${String(nextDayNum).padStart(2, '0')}`
    });
    nextDayNum++;
  }
  
  // Split into rows of 7
  const rows = [];
  for (let r = 0; r < cells.length; r += 7) {
    rows.push(cells.slice(r, r + 7));
  }
  
  return {
    cells,
    rows,
    totalRows: rows.length,
    daysInCurrentMonth,
    startDayOffset
  };
}

// Built-in holiday recognizer
export const DEFAULT_HOLIDAYS = {
  '10-31': 'Halloween',
  '11-08': 'Diwali (Festival of Lights)',
  '12-06': 'Saint Nicholas Day',
  '12-14': 'Hanukkah Begins',
  '12-21': 'Winter Solstice (Yule)',
  '12-24': 'Christmas Eve',
  '12-25': 'Christmas Day',
  '12-31': "New Year's Eve",
  '01-01': "New Year's Day",
  '01-06': 'Epiphany (Three Kings Day)',
  '02-14': "Valentine's Day",
  '03-17': "St. Patrick's Day",
  '07-04': 'Independence Day',
  '11-11': 'Veterans Day',
};
