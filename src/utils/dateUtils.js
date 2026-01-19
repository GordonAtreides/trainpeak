// Date utility functions

export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const getWeekDates = (date, weeks = 1) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start

  const monday = new Date(d.setDate(diff));
  const dates = [];

  for (let i = 0; i < 7 * weeks; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    dates.push(formatDate(currentDate));
  }

  return dates;
};

export const getDayName = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getDayNumber = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.getDate();
};

export const getMonthName = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short' });
};

export const isToday = (dateStr) => {
  const today = formatDate(new Date());
  return dateStr === today;
};

export const addWeeks = (dateStr, weeks) => {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + (weeks * 7));
  return formatDate(date);
};

export const getWeekRange = (dates) => {
  if (!dates || dates.length === 0) return '';
  const start = new Date(dates[0] + 'T00:00:00');
  const end = new Date(dates[dates.length - 1] + 'T00:00:00');

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
};

export const getLast90Days = () => {
  const dates = [];
  const today = new Date();

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDate(date));
  }

  return dates;
};

export const getMonthDates = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Find the Monday before or on the first day
  const startDay = firstDay.getDay();
  const daysToSubtract = startDay === 0 ? 6 : startDay - 1;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - daysToSubtract);

  // Find the Sunday after or on the last day
  const endDay = lastDay.getDay();
  const daysToAdd = endDay === 0 ? 0 : 7 - endDay;
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + daysToAdd);

  // Generate all dates
  const dates = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push({
      date: formatDate(current),
      dayNumber: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
    });
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const addMonths = (dateStr, months) => {
  const date = new Date(dateStr + 'T00:00:00');
  date.setMonth(date.getMonth() + months);
  return formatDate(date);
};

export const getMonthYear = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};
