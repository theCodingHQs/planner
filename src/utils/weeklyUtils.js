// Undated Weekly planner layouts configuration & weekday helpers

export const WEEKLY_LAYOUTS = [
  {
    id: 'columns-7',
    name: '7 Vertical Columns',
    category: 'Classic',
    desc: '7 daily vertical columns (Mon–Sun or Sun–Sat) with lined task spaces',
  },
  {
    id: 'grid-8',
    name: '8-Box Grid (4 × 2)',
    category: 'Balanced',
    desc: '4 days on top row, 3 days + Weekly Goals on bottom row',
  },
  {
    id: 'horizontal',
    name: 'Split Horizontal Rows',
    category: 'Spacious',
    desc: 'Two wide columns: Mon–Wed on the left, Thu–Sun + Notes on the right',
  },
  {
    id: 'dashboard',
    name: 'Productivity Dashboard',
    category: 'Habits & Goals',
    desc: 'Daily action boxes paired with a 7-day Habit Tracker matrix & Weekly Priorities',
  },
];

export const BOX_INTERIOR_STYLES = [
  { id: 'lines', label: 'Ruled Lines (Handwriting)' },
  { id: 'checkboxes', label: 'Checklist (To-Do Boxes)' },
  { id: 'schedule', label: 'Hourly Schedule (8am - 6pm)' },
  { id: 'blank', label: 'Blank / Minimalist' },
];

export const WEEKDAY_ORDER_MONDAY = [
  { id: 'mon', name: 'Monday', short: 'MON', initial: 'M', isWeekend: false },
  { id: 'tue', name: 'Tuesday', short: 'TUE', initial: 'T', isWeekend: false },
  { id: 'wed', name: 'Wednesday', short: 'WED', initial: 'W', isWeekend: false },
  { id: 'thu', name: 'Thursday', short: 'THU', initial: 'T', isWeekend: false },
  { id: 'fri', name: 'Friday', short: 'FRI', initial: 'F', isWeekend: false },
  { id: 'sat', name: 'Saturday', short: 'SAT', initial: 'S', isWeekend: true },
  { id: 'sun', name: 'Sunday', short: 'SUN', initial: 'S', isWeekend: true },
];

export const WEEKDAY_ORDER_SUNDAY = [
  { id: 'sun', name: 'Sunday', short: 'SUN', initial: 'S', isWeekend: true },
  { id: 'mon', name: 'Monday', short: 'MON', initial: 'M', isWeekend: false },
  { id: 'tue', name: 'Tuesday', short: 'TUE', initial: 'T', isWeekend: false },
  { id: 'wed', name: 'Wednesday', short: 'WED', initial: 'W', isWeekend: false },
  { id: 'thu', name: 'Thursday', short: 'THU', initial: 'T', isWeekend: false },
  { id: 'fri', name: 'Friday', short: 'FRI', initial: 'F', isWeekend: false },
  { id: 'sat', name: 'Saturday', short: 'SAT', initial: 'S', isWeekend: true },
];

/**
 * Returns purely undated weekdays according to week start (1 = Monday, 0 = Sunday).
 * Absolutely no dates, months, or year numbers.
 */
export function getUndatedWeekDays(startOfWeek = 1) {
  const baseList = startOfWeek === 1 ? WEEKDAY_ORDER_MONDAY : WEEKDAY_ORDER_SUNDAY;
  return baseList.map(item => ({
    dayId: item.id,
    dayName: item.name,
    dayShort: item.short,
    initial: item.initial,
    isWeekend: item.isWeekend,
    dateKey: `weekly-${item.id}`,
  }));
}
