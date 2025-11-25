<template>
<div class="time-input">
<div class="time-input-fields">
<input
type="text"
class="hour-input"
:value="hour"
@input="updateHour($event.target.value)"
@blur="formatHour"
:disabled="disabled"
maxlength="2"
aria-label="Hour"
/>
<span class="time-separator">:</span>
<input
type="text"
class="minute-input"
:value="minute"
@input="updateMinute($event.target.value)"
@blur="formatMinute"
:disabled="disabled"
maxlength="2"
aria-label="Minute"
/>
</div>
<div v-if="showError" class="error-message">
Minutes must be 00, 15, 30, or 45
</div>
</div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
name: 'TimeInput',
props: {
modelValue: {
type: String,
default: '00:00'
},
disabled: {
type: Boolean,
default: false
}
},
emits: ['update:modelValue'],
setup(props, { emit }) {
const parseTime = (timeString) => {
if (!timeString || typeof timeString !== 'string') return { hour: '00', minute: '00' };
const [hour = '00', minute = '00'] = timeString.split(':');
return { hour, minute };
};

const { hour: initialHour, minute: initialMinute } = parseTime(props.modelValue);
const hour = ref(initialHour);
const minute = ref(initialMinute);
const showError = ref(false);

// Valid minute values (15-minute increments)
const validMinutes = ['00', '15', '30', '45'];

const formatTime = () => {
const formattedHour = hour.value.padStart(2, '0');
const formattedMinute = minute.value.padStart(2, '0');
return `${formattedHour}:${formattedMinute}`;
};

// Convert local time to GMT+00:00
const convertToGMT = (timeString) => {
if (!timeString) return '00:00';

try {
// Create a date object with today's date and the time from input
const now = new Date();
const [hours, minutes] = timeString.split(':').map(Number);

const localDate = new Date(
now.getFullYear(),
now.getMonth(),
now.getDate(),
hours,
minutes
);

// Convert to UTC (GMT+00:00)
const utcHours = String(localDate.getUTCHours()).padStart(2, '0');
const utcMinutes = String(localDate.getUTCMinutes()).padStart(2, '0');

return `${utcHours}:${utcMinutes}`;
} catch (error) {
console.error('Error converting time to GMT:', error);
return timeString; // Return original if conversion fails
}
};

const updateHour = (value) => {
if (value === '') {
hour.value = '';
return;
}
const numericValue = value.replace(/[^0-9]/g, '');
const hourNum = parseInt(numericValue, 10);
if (!isNaN(hourNum) && hourNum >= 0 && hourNum <= 23) {
hour.value = numericValue.slice(0, 2);
} else if (numericValue === '') {
hour.value = '';
}
};

const formatHour = () => {
if (hour.value === '') {
hour.value = '00';
} else {
const hourNum = parseInt(hour.value, 10);
hour.value = String(hourNum).padStart(2, '0');
}
emitTimeValue();
};

const updateMinute = (value) => {
if (value === '') {
minute.value = '';
showError.value = false;
return;
}
const numericValue = value.replace(/[^0-9]/g, '');
const minuteNum = parseInt(numericValue, 10);
if (!isNaN(minuteNum) && minuteNum >= 0 && minuteNum <= 59) {
minute.value = numericValue.slice(0, 2);
} else if (numericValue === '') {
minute.value = '';
}
};

const formatMinute = () => {
if (minute.value === '') {
minute.value = '00';
showError.value = false;
} else {
const minuteNum = parseInt(minute.value, 10);

// Round to nearest 15-minute increment
const roundedMinute = Math.round(minuteNum / 15) * 15;
if (roundedMinute === 60) {
// If rounding to 60, set to 00 and increment hour
minute.value = '00';
const hourNum = parseInt(hour.value, 10);
hour.value = String((hourNum + 1) % 24).padStart(2, '0');
} else {
minute.value = String(roundedMinute).padStart(2, '0');
}
showError.value = !validMinutes.includes(minute.value);
}
emitTimeValue();
};

const emitTimeValue = () => {
const timeString = formatTime();
// Convert to GMT+00:00 before emitting
// const gmtTime = convertToGMT(timeString);
emit('update:modelValue', timeString);
};

watch(() => props.modelValue, (newValue) => {
const { hour: newHour, minute: newMinute } = parseTime(newValue);
hour.value = newHour;
minute.value = newMinute;
showError.value = !validMinutes.includes(minute.value);
});

return {
hour,
minute,
showError,
updateHour,
updateMinute,
formatHour,
formatMinute
};
}
};
</script>

<style scoped>
.time-input {
display: inline-flex;
flex-direction: column;
}

.time-input-fields {
display: flex;
align-items: center;
border: 1px solid #ccc;
border-radius: 4px;
padding: 4px 8px;
background-color: #fff;
}

.hour-input,
.minute-input {
width: 24px;
border: none;
text-align: center;
font-size: 14px;
outline: none;
background: transparent;
}

.time-separator {
margin: 0 2px;
font-weight: bold;
}

.time-input-fields:focus-within {
border-color: #265298;
box-shadow: 0 0 0 2px rgba(38, 82, 152, 0.2);
}

.error-message {
color: #e53935;
font-size: 12px;
margin-top: 4px;
}
</style>