/**
 * Utility functions for week navigation and date management
 */

export interface WeekRange {
  startDate: Date;
  endDate: Date;
  dates: Date[];
}

/**
 * Get the current week range (Monday to Sunday)
 */
export const getCurrentWeek = (): WeekRange => {
  const today = new Date();
  return getWeekRange(today);
};

/**
 * Get the first week of the current month (may include days from previous month)
 */
export const getFirstWeekOfCurrentMonth = (): WeekRange => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  
  // Get the week that contains the first day of the month
  return getWeekRange(firstDayOfMonth);
};

/**
 * Get week range for a given date
 */
export const getWeekRange = (date: Date): WeekRange => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date);
  }

  return {
    startDate: startOfWeek,
    endDate: endOfWeek,
    dates
  };
};

/**
 * Check if a week contains any days from the current month
 */
export const isWeekInCurrentMonth = (week: WeekRange): boolean => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Check if any day in the week belongs to the current month
  return week.dates.some(date => 
    date.getMonth() === currentMonth && 
    date.getFullYear() === currentYear
  );
};

/**
 * Check if a week is completely within the current month
 */
export const isWeekCompletelyInCurrentMonth = (week: WeekRange): boolean => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  return week.dates.every(date => 
    date.getMonth() === currentMonth && 
    date.getFullYear() === currentYear
  );
};

/**
 * Get the next week range (restricted to weeks that contain current month days)
 */
export const getNextWeek = (currentWeek: WeekRange): WeekRange | null => {
  const nextWeekStart = new Date(currentWeek.startDate);
  nextWeekStart.setDate(currentWeek.startDate.getDate() + 7);
  const nextWeek = getWeekRange(nextWeekStart);
  
  // Check if the next week contains any days from the current month
  if (isWeekInCurrentMonth(nextWeek)) {
    return nextWeek;
  }
  
  return null;
};

/**
 * Get the previous week range (restricted to weeks that contain current month days)
 */
export const getPreviousWeek = (currentWeek: WeekRange): WeekRange | null => {
  const prevWeekStart = new Date(currentWeek.startDate);
  prevWeekStart.setDate(currentWeek.startDate.getDate() - 7);
  const prevWeek = getWeekRange(prevWeekStart);
  
  // Check if the previous week contains any days from the current month
  if (isWeekInCurrentMonth(prevWeek)) {
    return prevWeek;
  }
  
  return null;
};

/**
 * Format date for display in DateCell
 */
export const formatDateForDisplay = (date: Date): number => {
  return date.getDate();
};

/**
 * Get day name for a given date
 */
export const getDayName = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if next week navigation is possible (within current month)
 */
export const canNavigateNext = (currentWeek: WeekRange): boolean => {
  return getNextWeek(currentWeek) !== null;
};

/**
 * Check if previous week navigation is possible (within current month)
 */
export const canNavigatePrevious = (currentWeek: WeekRange): boolean => {
  return getPreviousWeek(currentWeek) !== null;
};

/**
 * Get all weeks that contain days from the current month
 */
export const getAllWeeksInCurrentMonth = (): WeekRange[] => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  
  // Get the last day of the current month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
  // Find the first week that contains the first day of the month
  const firstWeek = getWeekRange(firstDayOfMonth);
  
  // Find the last week that contains the last day of the month
  const lastWeek = getWeekRange(lastDayOfMonth);
  
  const weeks: WeekRange[] = [];
  let currentWeek = firstWeek;
  
  // Add all weeks from first to last
  while (currentWeek.startDate <= lastWeek.startDate) {
    weeks.push(currentWeek);
    const nextWeekStart = new Date(currentWeek.startDate);
    nextWeekStart.setDate(currentWeek.startDate.getDate() + 7);
    currentWeek = getWeekRange(nextWeekStart);
  }
  
  return weeks;
};

/**
 * Get week range display string (e.g., "Dec 2 - Dec 8, 2024")
 */
export const getWeekRangeDisplay = (weekRange: WeekRange): string => {
  const startMonth = weekRange.startDate.toLocaleString('default', { month: 'short' });
  const startDay = weekRange.startDate.getDate();
  const endMonth = weekRange.endDate.toLocaleString('default', { month: 'short' });
  const endDay = weekRange.endDate.getDate();
  const year = weekRange.startDate.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
};
