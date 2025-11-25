---
name: cron-schedule-builder
description: A flexible schedule builder component with multiple frequency options and real-time validation for configuring report schedules.
keywords: cron, schedule, calendar, recurring, frequency, daily, weekly, monthly, time
---

#### CronScheduleBuilder

***Purpose:***
A comprehensive schedule builder that allows users to configure recurring schedules using various frequency options (Daily, Weekly, Bi-weekly, Monthly, etc.) with appropriate controls for each mode.

***Features:***
- Multiple scheduling modes: Daily, Weekly, Bi-weekly, Monthly, Bi-monthly, Six-monthly, Annually, Every N, and Cron
- Single day selection for Weekly and Bi-weekly modes
- Real-time validation with error messages
- Schedule preview with human-readable description
- Next 5 runs calculation based on selected timezone
- Timezone support for accurate scheduling (default: America/New_York)
- 24-hour time format support
- Square day selector buttons with rounded corners and centered text
- Custom color scheme (#265298) for selected buttons and active tabs
- Time input with 15-minute increment validation (00, 15, 30, 45)
- Automatic conversion of input time to GMT+00:00 for database storage
- No external dependencies - uses only native JavaScript functionality

***Properties:***
- value: object - The initial schedule configuration object with mode, time, and other schedule-specific properties
- timezone: string - The timezone to use for schedule calculations (default: 'America/New_York')
- disabled: boolean - When true, disables all form controls in the component

***Events:***
- change: Triggered when any part of the schedule configuration changes. Payload: { value: scheduleObject }
- validityChange: Triggered when the validity of the schedule changes. Payload: { isValid: boolean, errors: object }

***Exposed Variables:***
- value: The current schedule configuration object (path: variables['current_element_uid-value'])

***Notes:***
- The component supports various scheduling patterns from simple daily schedules to complex cron expressions
- Weekly and Bi-weekly modes enforce single day selection (e.g., every Wednesday at 17:00)
- Time is displayed and stored in 24-hour format (HH:mm)
- All schedule calculations respect the specified timezone (default: America/New_York)
- For the "Every N" mode, time is only required when the unit is "days"
- The schedule preview shows a human-readable description and the next 5 run times
- Cron expressions support both 5-field (minute hour day-of-month month day-of-week) and 6-field formats (with seconds)
- The component automatically normalizes 6-field cron expressions to 5-field format
- Day selector buttons are square with rounded corners and centered text
- Selected elements use the custom color #265298 to match the application's visual style
- Time input only accepts values in 15-minute increments (00, 15, 30, 45)
- All time values are automatically converted to GMT+00:00 timezone for database storage
- Uses native JavaScript Date API and Intl.DateTimeFormat for all date/time operations