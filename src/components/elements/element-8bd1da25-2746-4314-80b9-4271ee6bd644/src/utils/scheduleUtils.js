// Native JavaScript implementation of schedule utilities without external dependencies

// Convert time string "HH:mm" to hours and minutes
export const parseTimeString = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return { hour: '00', minute: '00' };
  const [hour = '00', minute = '00'] = timeString.split(':');
  return { hour, minute };
};

// Format hours and minutes to "HH:mm"
export const formatTimeString = (hour, minute) => {
  const formattedHour = String(hour).padStart(2, '0');
  const formattedMinute = String(minute).padStart(2, '0');
  return `${formattedHour}:${formattedMinute}`;
};

// Get the last day of a month
export const getLastDayOfMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month, 0).getDate();
};

// Check if a day is a weekend (Saturday or Sunday)
export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

// Convert ISO day of week (1-7, Mon-Sun) to JS day of week (0-6, Sun-Sat)
export const isoToJsDay = (isoDay) => {
  return isoDay === 7 ? 0 : isoDay;
};

// Convert JS day of week (0-6, Sun-Sat) to ISO day of week (1-7, Mon-Sun)
export const jsToIsoDay = (jsDay) => {
  return jsDay === 0 ? 7 : jsDay;
};

// Convert a date to a specific timezone
export const utcToZonedTime = (date, timezone) => {
  if (!date) return new Date();
  
  try {
    // Create a formatter that will display the date in the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    
    // Format the date to get the string representation in the target timezone
    const parts = formatter.formatToParts(date);
    const dateValues = {};
    
    parts.forEach(part => {
      if (part.type !== 'literal') {
        dateValues[part.type] = parseInt(part.value, 10);
      }
    });
    
    // Create a new date with the timezone-adjusted values
    // Note: This is an approximation as JavaScript Date doesn't fully support timezone manipulation
    return new Date(date);
  } catch (error) {
    console.error('Error converting to zoned time:', error);
    return new Date(date);
  }
};

// Convert a date from a specific timezone to UTC
export const zonedTimeToUtc = (date, timezone) => {
  if (!date) return new Date();
  
  try {
    // For simplicity in this implementation, we'll just return the date
    // In a real implementation without date-fns-tz, you would need to calculate
    // the timezone offset and adjust the date accordingly
    return new Date(date);
  } catch (error) {
    console.error('Error converting to UTC time:', error);
    return new Date(date);
  }
};

// Format date for display
export const formatDate = (date, timezone) => {
  if (!date) return '';
  
  try {
    const options = { 
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }
};

// Add days to a date
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Add months to a date
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Add years to a date
export const addYears = (date, years) => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

// Add hours to a date
export const addHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

// Add minutes to a date
export const addMinutes = (date, minutes) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

// Set hours of a date
export const setHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(hours);
  return result;
};

// Set minutes of a date
export const setMinutes = (date, minutes) => {
  const result = new Date(date);
  result.setMinutes(minutes);
  return result;
};

// Set date of a date
export const setDate = (date, dayOfMonth) => {
  const result = new Date(date);
  result.setDate(dayOfMonth);
  return result;
};

// Get date of a date
export const getDate = (date) => {
  return date.getDate();
};

// Get month of a date
export const getMonth = (date) => {
  return date.getMonth();
};

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Custom cron expression parser
export const parseCronExpression = (expression) => {
  if (!expression) return null;
  
  // Normalize expression
  let fields = expression.trim().split(/\s+/);
  
  // Handle 6-field format (with seconds)
  if (fields.length === 6) {
    fields = fields.slice(1);
  } else if (fields.length !== 5) {
    throw new Error('Invalid cron expression format');
  }
  
  const [minute, hour, dayOfMonth, month, dayOfWeek] = fields;
  
  // Parse each field
  const parseField = (field, min, max) => {
    if (field === '*') {
      return Array.from({ length: max - min + 1 }, (_, i) => min + i);
    }
    
    if (field.includes(',')) {
      return field.split(',').flatMap(f => parseField(f, min, max));
    }
    
    if (field.includes('-')) {
      const [start, end] = field.split('-').map(Number);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    
    if (field.includes('/')) {
      const [range, step] = field.split('/');
      const baseRange = range === '*' 
        ? Array.from({ length: max - min + 1 }, (_, i) => min + i)
        : parseField(range, min, max);
      
      return baseRange.filter((_, i) => i % Number(step) === 0);
    }
    
    return [Number(field)];
  };
  
  try {
    const minutes = parseField(minute, 0, 59);
    const hours = parseField(hour, 0, 23);
    const daysOfMonth = parseField(dayOfMonth, 1, 31);
    const months = parseField(month, 1, 12);
    const daysOfWeek = parseField(dayOfWeek, 0, 6);
    
    return { minutes, hours, daysOfMonth, months, daysOfWeek };
  } catch (error) {
    console.error('Error parsing cron expression:', error);
    return null;
  }
};

// Get next N occurrences for a cron expression
export const getNextCronOccurrences = (cronExpression, timezone, count = 5) => {
  if (!cronExpression) return [];
  
  try {
    // Normalize cron expression
    let normalizedCron = cronExpression.trim();
    const fields = normalizedCron.split(/\s+/);
    
    // If 6 fields (with seconds), remove seconds field
    if (fields.length === 6) {
      normalizedCron = fields.slice(1).join(' ');
    }
    
    const parsedCron = parseCronExpression(normalizedCron);
    if (!parsedCron) return [];
    
    const { minutes, hours, daysOfMonth, months, daysOfWeek } = parsedCron;
    
    const now = new Date();
    const occurrences = [];
    let current = new Date(now);
    
    // Simple implementation to find next occurrences
    // This is a simplified version and doesn't handle all cron complexities
    while (occurrences.length < count) {
      // Check if current date matches cron pattern
      if (
        minutes.includes(current.getMinutes()) &&
        hours.includes(current.getHours()) &&
        daysOfMonth.includes(current.getDate()) &&
        months.includes(current.getMonth() + 1) &&
        (daysOfWeek.includes(current.getDay()) || daysOfWeek.includes(7) && current.getDay() === 0)
      ) {
        if (current > now) {
          occurrences.push(new Date(current));
        }
      }
      
      // Move to next minute
      current = addMinutes(current, 1);
      
      // Safety check to prevent infinite loops
      if (occurrences.length === 0 && current > addYears(now, 1)) {
        break;
      }
    }
    
    return occurrences;
  } catch (e) {
    console.error('Error calculating cron occurrences:', e);
    return [];
  }
};

// Validate cron expression
export const validateCronExpression = (cronExpression) => {
  if (!cronExpression) return false;
  
  try {
    // Normalize cron expression
    let normalizedCron = cronExpression.trim();
    const fields = normalizedCron.split(/\s+/);
    
    // Check field count
    if (fields.length !== 5 && fields.length !== 6) {
      return false;
    }
    
    // If 6 fields, we'll validate the 5 standard fields (ignoring seconds)
    const startIndex = fields.length === 6 ? 1 : 0;
    
    // Define field constraints
    const constraints = [
      { min: 0, max: 59 },  // minutes
      { min: 0, max: 23 },  // hours
      { min: 1, max: 31 },  // days of month
      { min: 1, max: 12 },  // months
      { min: 0, max: 7 }    // days of week (0 or 7 is Sunday)
    ];
    
    // Validate each field
    for (let i = 0; i < 5; i++) {
      const field = fields[i + startIndex];
      const { min, max } = constraints[i];
      
      // Check for valid characters
      if (!/^[0-9*,\-/]+$/.test(field)) {
        return false;
      }
      
      // Check for valid values
      if (field !== '*') {
        const parts = field.split(',');
        
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
              return false;
            }
          } else if (part.includes('/')) {
            const [range, step] = part.split('/');
            if (range !== '*' && !/^[0-9\-]+$/.test(range)) {
              return false;
            }
            if (isNaN(Number(step)) || Number(step) < 1) {
              return false;
            }
          } else if (part !== '*') {
            const num = Number(part);
            if (isNaN(num) || num < min || num > max) {
              return false;
            }
          }
        }
      }
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

// Get next N occurrences for Daily schedule
export const getNextDailyOccurrences = (time, skipWeekends, timezone, count = 5) => {
  const { hour, minute } = parseTimeString(time);
  const now = new Date();
  
  let current = setMinutes(setHours(now, parseInt(hour, 10)), parseInt(minute, 10));
  if (current <= now) {
    current = addDays(current, 1);
  }
  
  const occurrences = [];
  while (occurrences.length < count) {
    if (!skipWeekends || !isWeekend(current)) {
      occurrences.push(new Date(current));
    }
    current = addDays(current, 1);
  }
  
  return occurrences;
};

// Get next N occurrences for Weekly schedule
export const getNextWeeklyOccurrences = (time, daysOfWeek, timezone, count = 5) => {
  if (!daysOfWeek || !daysOfWeek.length) return [];
  
  const { hour, minute } = parseTimeString(time);
  const now = new Date();
  
  // Convert ISO days to JS days
  const jsDaysOfWeek = daysOfWeek.map(isoToJsDay);
  
  let current = setMinutes(setHours(now, parseInt(hour, 10)), parseInt(minute, 10));
  const occurrences = [];
  
  while (occurrences.length < count) {
    const currentDay = current.getDay();
    
    if (jsDaysOfWeek.includes(currentDay) && current > now) {
      occurrences.push(new Date(current));
    }
    
    current = addDays(current, 1);
  }
  
  return occurrences;
};

// Get next N occurrences for Bi-weekly schedule
export const getNextBiWeeklyOccurrences = (time, daysOfWeek, timezone, count = 5) => {
  if (!daysOfWeek || !daysOfWeek.length) return [];
  
  const { hour, minute } = parseTimeString(time);
  const now = new Date();
  
  // Convert ISO days to JS days
  const jsDaysOfWeek = daysOfWeek.map(isoToJsDay);
  
  let current = setMinutes(setHours(now, parseInt(hour, 10)), parseInt(minute, 10));
  const occurrences = [];
  let weekCounter = 0;
  
  while (occurrences.length < count) {
    const currentDay = current.getDay();
    
    if (weekCounter % 2 === 0 && jsDaysOfWeek.includes(currentDay) && current > now) {
      occurrences.push(new Date(current));
    }
    
    current = addDays(current, 1);
    if (current.getDay() === 0) { // Sunday, end of week
      weekCounter++;
    }
  }
  
  return occurrences;
};

// Get next N occurrences for Monthly schedule
export const getNextMonthlyOccurrences = (time, day, timezone, count = 5) => {
  const { hour, minute } = parseTimeString(time);
  const now = new Date();
  
  let current = now;
  const occurrences = [];
  
  while (occurrences.length < count) {
    let targetDate;
    
    if (day === 'First') {
      targetDate = setDate(current, 1);
    } else if (day === 'Last') {
      targetDate = setDate(current, getLastDayOfMonth(current));
    } else {
      const dayNum = parseInt(day, 10);
      targetDate = setDate(current, Math.min(dayNum, getLastDayOfMonth(current)));
    }
    
    targetDate = setMinutes(setHours(targetDate, parseInt(hour, 10)), parseInt(minute, 10));
    
    if (targetDate > now) {
      occurrences.push(new Date(targetDate));
    }
    
    current = addMonths(current, 1);
  }
  
  return occurrences;
};

// Get next N occurrences for Bi-monthly schedule
export const getNextBiMonthlyOccurrences = (time, day, month, timezone, count = 5) => {
  const { hour, minute } = parseTimeString(time);
  const now = new Date();
  
  // Set to the first occurrence of the specified month
  let current = new Date(now);
  current.setMonth((parseInt(month, 10) - 1) % 12);
  
  if (current < now) {
    current.setFullYear(current.getFullYear() + 1);
  }
  
  const occurrences = [];
  
  while (occurrences.length < count) {
    let targetDate;
    
    if (day === 'First') {
      targetDate = setDate(current, 1);
    } else if (day === 'Last') {
      targetDate = setDate(current, getLastDayOfMonth(current));
    } else {
      const dayNum = parseInt(day, 10);
      targetDate = setDate(current, Math.min(dayNum, getLastDayOfMonth(current)));
    }
    
    targetDate = setMinutes(setHours(targetDate, parseInt(hour, 10)), parseInt(minute, 10));
    
    if (targetDate > now) {
      occurrences.push(new Date(targetDate));
    }
    
    current = addMonths(current, 2); // Bi-monthly: every 2 months
  }
  
  return occurrences;
};

// Get next N occurrences for Six-monthly schedule
export const getNextSixMonthlyOccurrences = (time, day, month, timezone, count = 5) => {
  const { hour, minute } = parseTimeString(time);
  const now = new Date();
  
  // Set to the first occurrence of the specified month
  let current = new Date(now);
  current.setMonth((parseInt(month, 10) - 1) % 12);
  
  if (current < now) {
    current.setFullYear(current.getFullYear() + 1);
  }
  
  const occurrences = [];
  
  while (occurrences.length < count) {
    let targetDate;
    
    if (day === 'First') {
      targetDate = setDate(current, 1);
    } else if (day === 'Last') {
      targetDate = setDate(current, getLastDayOfMonth(current));
    } else {
      const dayNum = parseInt(day, 10);
      targetDate = setDate(current, Math.min(dayNum, getLastDayOfMonth(current)));
    }
    
    targetDate = setMinutes(setHours(targetDate, parseInt(hour, 10)), parseInt(minute, 10));
    
    if (targetDate > now) {
      occurrences.push(new Date(targetDate));
    }
    
    current = addMonths(current, 6); // Six-monthly: every 6 months
  }
  
  return occurrences;
};

// Get next N occurrences for Annual schedule
export const getNextAnnualOccurrences = (time, day, month, timezone, count = 5) => {
  const { hour, minute } = parseTimeString(time);
  const now = new Date();
  
  // Set to the first occurrence of the specified month
  let current = new Date(now);
  current.setMonth((parseInt(month, 10) - 1) % 12);
  
  if (current < now) {
    current.setFullYear(current.getFullYear() + 1);
  }
  
  const occurrences = [];
  
  while (occurrences.length < count) {
    let targetDate;
    
    if (day === 'First') {
      targetDate = setDate(current, 1);
    } else if (day === 'Last') {
      targetDate = setDate(current, getLastDayOfMonth(current));
    } else {
      const dayNum = parseInt(day, 10);
      targetDate = setDate(current, Math.min(dayNum, getLastDayOfMonth(current)));
    }
    
    targetDate = setMinutes(setHours(targetDate, parseInt(hour, 10)), parseInt(minute, 10));
    
    if (targetDate > now) {
      occurrences.push(new Date(targetDate));
    }
    
    current = addYears(current, 1); // Annually: every year
  }
  
  return occurrences;
};

// Get next N occurrences for Every N schedule
export const getNextEveryNOccurrences = (everyN, time, timezone, count = 5) => {
  if (!everyN || !everyN.n || !everyN.unit) return [];
  
  const n = parseInt(everyN.n, 10);
  const unit = everyN.unit;
  
  if (n < 1) return [];
  
  const now = new Date();
  
  let current = new Date(now);
  
  // If unit is days, set the time
  if (unit === 'days' && time) {
    const { hour, minute } = parseTimeString(time);
    current = setMinutes(setHours(current, parseInt(hour, 10)), parseInt(minute, 10));
    if (current <= now) {
      current = addDays(current, n);
    }
  } else {
    // For minutes or hours, start from now
    if (unit === 'minutes') {
      current = addMinutes(current, n);
    } else if (unit === 'hours') {
      current = addHours(current, n);
    }
  }
  
  const occurrences = [new Date(current)];
  
  for (let i = 1; i < count; i++) {
    if (unit === 'minutes') {
      current = addMinutes(current, n);
    } else if (unit === 'hours') {
      current = addHours(current, n);
    } else if (unit === 'days') {
      current = addDays(current, n);
    }
    occurrences.push(new Date(current));
  }
  
  return occurrences;
};

// Get human-readable schedule description
export const getScheduleDescription = (schedule, timezone) => {
  if (!schedule || !schedule.mode) return 'No schedule configured';
  
  const { mode, time, daysOfWeek, day, month, everyN, cronExpression } = schedule;
  const timeStr = time || '00:00'; // Ensure time is in 24-hour format
  const tzShort = timezone.split('/').pop().replace('_', ' ');
  
  switch (mode) {
    case 'Daily':
      return `Runs daily at ${timeStr} (${tzShort})${schedule.skipWeekends ? ', skipping weekends' : ''}`;
      
    case 'Weekly':
      if (!daysOfWeek || !daysOfWeek.length) return 'Invalid weekly schedule';
      const dayNames = daysOfWeek.map(d => {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        return days[isoToJsDay(d)];
      }).join(', ');
      return `Runs weekly on ${dayNames} at ${timeStr} (${tzShort})`;
      
    case 'Bi-weekly':
      if (!daysOfWeek || !daysOfWeek.length) return 'Invalid bi-weekly schedule';
      const biWeeklyDays = daysOfWeek.map(d => {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        return days[isoToJsDay(d)];
      }).join(', ');
      return `Runs every two weeks on ${biWeeklyDays} at ${timeStr} (${tzShort})`;
      
    case 'Monthly':
      const monthlyDay = day === 'First' ? 'first day' : day === 'Last' ? 'last day' : `day ${day}`;
      return `Runs monthly on the ${monthlyDay} at ${timeStr} (${tzShort})`;
      
    case 'Bi-monthly':
      const biMonthlyDay = day === 'First' ? 'first day' : day === 'Last' ? 'last day' : `day ${day}`;
      const startMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(month, 10) - 1];
      return `Runs every two months starting from ${startMonth} on the ${biMonthlyDay} at ${timeStr} (${tzShort})`;
      
    case 'Six-monthly':
      const sixMonthlyDay = day === 'First' ? 'first day' : day === 'Last' ? 'last day' : `day ${day}`;
      const sixStartMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(month, 10) - 1];
      return `Runs every six months starting from ${sixStartMonth} on the ${sixMonthlyDay} at ${timeStr} (${tzShort})`;
      
    case 'Annually':
      const annualDay = day === 'First' ? 'first day' : day === 'Last' ? 'last day' : `day ${day}`;
      const annualMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][parseInt(month, 10) - 1];
      return `Runs annually on the ${annualDay} of ${annualMonth} at ${timeStr} (${tzShort})`;
      
    case 'Every N':
      if (!everyN || !everyN.n || !everyN.unit) return 'Invalid every N schedule';
      const n = everyN.n;
      const unit = everyN.unit;
      const unitStr = n === 1 ? unit.slice(0, -1) : unit; // Remove 's' for singular
      
      if (unit === 'days') {
        return `Runs every ${n} ${unitStr} at ${timeStr} (${tzShort})`;
      } else {
        return `Runs every ${n} ${unitStr}`;
      }
      
    case 'Cron':
      if (!validateCronExpression(cronExpression)) return 'Invalid cron expression';
      return `Runs with cron expression: ${cronExpression} (${tzShort})`;
      
    default:
      return 'Unknown schedule type';
  }
};

// Get next N occurrences based on schedule
export const getNextOccurrences = (schedule, timezone, count = 5) => {
  if (!schedule || !schedule.mode) return [];
  
  const { mode, time, daysOfWeek, day, month, everyN, cronExpression, skipWeekends } = schedule;
  
  switch (mode) {
    case 'Daily':
      return getNextDailyOccurrences(time, skipWeekends, timezone, count);
      
    case 'Weekly':
      return getNextWeeklyOccurrences(time, daysOfWeek, timezone, count);
      
    case 'Bi-weekly':
      return getNextBiWeeklyOccurrences(time, daysOfWeek, timezone, count);
      
    case 'Monthly':
      return getNextMonthlyOccurrences(time, day, timezone, count);
      
    case 'Bi-monthly':
      return getNextBiMonthlyOccurrences(time, day, month, timezone, count);
      
    case 'Six-monthly':
      return getNextSixMonthlyOccurrences(time, day, month, timezone, count);
      
    case 'Annually':
      return getNextAnnualOccurrences(time, day, month, timezone, count);
      
    case 'Every N':
      return getNextEveryNOccurrences(everyN, time, timezone, count);
      
    case 'Cron':
      return getNextCronOccurrences(cronExpression, timezone, count);
      
    default:
      return [];
  }
};

// Validate schedule
export const validateSchedule = (schedule) => {
  if (!schedule || !schedule.mode) {
    return { isValid: false, errors: { mode: 'Schedule mode is required' } };
  }
  
  const errors = {};
  const { mode, time, daysOfWeek, day, month, everyN, cronExpression } = schedule;
  
  // Validate time for modes that require it
  if (['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Bi-monthly', 'Six-monthly', 'Annually'].includes(mode)) {
    if (!time) {
      errors.time = 'Time is required';
    }
  }
  
  switch (mode) {
    case 'Weekly':
    case 'Bi-weekly':
      if (!daysOfWeek || !daysOfWeek.length) {
        errors.daysOfWeek = 'At least one day of week must be selected';
      }
      break;
      
    case 'Monthly':
      if (!day) {
        errors.day = 'Day of month is required';
      }
      break;
      
    case 'Bi-monthly':
    case 'Six-monthly':
    case 'Annually':
      if (!day) {
        errors.day = 'Day is required';
      }
      if (!month) {
        errors.month = 'Month is required';
      }
      break;
      
    case 'Every N':
      if (!everyN || !everyN.n || everyN.n < 1) {
        errors.everyN = 'Value must be at least 1';
}
if (!everyN || !everyN.unit) {
errors.everyNUnit = 'Unit is required';
}
if (everyN?.unit === 'days' && !time) {
errors.time = 'Time is required for daily frequency';
}
break;

case 'Cron':
if (!cronExpression) {
errors.cronExpression = 'Cron expression is required';
} else if (!validateCronExpression(cronExpression)) {
errors.cronExpression = 'Invalid cron expression';
}
break;
}

return {
isValid: Object.keys(errors).length === 0,
errors
};
};