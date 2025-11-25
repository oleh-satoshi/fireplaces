<template>
<div class="cron-schedule-builder" :class="{ disabled }">
<div class="schedule-tabs">
<div
v-for="tab in tabs"
:key="tab.id"
class="schedule-tab"
:class="{ active: currentTab === tab.id }"
@click="!disabled && setTab(tab.id)"
>
{{ tab.label }}
</div>
</div>

<div class="schedule-content">
<!-- Daily Tab -->
<div v-if="currentTab === 'Daily'" class="tab-content">
<div class="form-group">
<label>Time</label>
<TimeInput v-model="scheduleState.time" :disabled="disabled" />
</div>
<div class="form-group">
<label class="checkbox-label">
<input
type="checkbox"
:checked="scheduleState.skipWeekends"
@change="updateSkipWeekends($event.target.checked)"
:disabled="disabled"
/>
Skip weekends
</label>
</div>
</div>

<!-- Weekly Tab -->
<div v-if="currentTab === 'Weekly'" class="tab-content">
<div class="form-group">
<label>Day of Week</label>
<DaySelector 
v-model="scheduleState.daysOfWeek" 
:disabled="disabled" 
:single-selection="true"
/>
<div class="help-text">
Select the day of the week for the schedule to run
</div>
<div v-if="errors.daysOfWeek" class="error-message">
{{ errors.daysOfWeek }}
</div>
</div>
<div class="form-group">
<label>Time</label>
<TimeInput v-model="scheduleState.time" :disabled="disabled" />
</div>
</div>

<!-- Bi-weekly Tab -->
<div v-if="currentTab === 'Bi-weekly'" class="tab-content">
<div class="form-group">
<label>Days of Week</label>
<DaySelector
v-model="scheduleState.daysOfWeek"
:disabled="disabled"
:single-selection="true"
/>
<div class="help-text">
Runs every two weeks on the selected day
</div>
<div v-if="errors.daysOfWeek" class="error-message">
{{ errors.daysOfWeek }}
</div>
</div>
<div class="form-group">
<label>Time</label>
<TimeInput v-model="scheduleState.time" :disabled="disabled" />
</div>
</div>

<!-- Monthly Tab -->
<div v-if="currentTab === 'Monthly'" class="tab-content">
<div class="form-group">
<label>Day of Month</label>
<DayOfMonthSelector v-model="scheduleState.day" :disabled="disabled" />
</div>
<div class="form-group">
<label>Time</label>
<TimeInput v-model="scheduleState.time" :disabled="disabled" />
</div>
</div>

<!-- Bi-monthly Tab -->
<div v-if="currentTab === 'Bi-monthly'" class="tab-content">
<div class="form-group">
<label>Starting Month</label>
<MonthSelector v-model="scheduleState.month" :disabled="disabled" />
<div class="help-text">
Runs every two months starting from the selected month
</div>
</div>
<div class="form-group">
<label>Day of Month</label>
<DayOfMonthSelector v-model="scheduleState.day" :disabled="disabled" />
</div>
<div class="form-group">
<label>Time</label>
<TimeInput v-model="scheduleState.time" :disabled="disabled" />
</div>
</div>

<!-- Six-monthly Tab -->
<div v-if="currentTab === 'Six-monthly'" class="tab-content">
<div class="form-group">
<label>Starting Month</label>
<MonthSelector v-model="scheduleState.month" :disabled="disabled" />
<div class="help-text">
Runs every six months starting from the selected month
</div>
</div>
<div class="form-group">
<label>Day of Month</label>
<DayOfMonthSelector v-model="scheduleState.day" :disabled="disabled" />
</div>
<div class="form-group">
<label>Time</label>
<TimeInput v-model="scheduleState.time" :disabled="disabled" />
</div>
</div>

<!-- Annually Tab -->
<div v-if="currentTab === 'Annually'" class="tab-content">
<div class="form-group">
<label>Month</label>
<MonthSelector v-model="scheduleState.month" :disabled="disabled" />
</div>
<div class="form-group">
<label>Day of Month</label>
<DayOfMonthSelector v-model="scheduleState.day" :disabled="disabled" />
</div>
<div class="form-group">
<label>Time</label>
<TimeInput v-model="scheduleState.time" :disabled="disabled" />
</div>
</div>

<!-- Every N Tab -->
<div v-if="currentTab === 'Every N'" class="tab-content">
<div class="form-group">
<EveryNSelector v-model="scheduleState.everyN" :disabled="disabled" />
<div v-if="errors.everyN" class="error-message">
{{ errors.everyN }}
</div>
</div>
<div v-if="showTimeForEveryN" class="form-group">
<label>Time</label>
<TimeInput v-model="scheduleState.time" :disabled="disabled" />
<div v-if="errors.time" class="error-message">
{{ errors.time }}
</div>
</div>
</div>

<!-- Cron Tab -->
<div v-if="currentTab === 'Cron'" class="tab-content">
<div class="form-group">
<label>Cron Expression</label>
<CronInput
v-model="scheduleState.cronExpression"
:disabled="disabled"
@validity-change="updateCronValidity"
/>
<div v-if="errors.cronExpression" class="error-message">
{{ errors.cronExpression }}
</div>
</div>
</div>
</div>

<!-- Schedule Preview -->
<!-- <SchedulePreview
:description="scheduleDescription"
:next-runs="nextRuns"
:timezone="timezone"
:is-valid="isValid"
/> -->
</div>
</template>

<script>
import { ref, computed, watch, reactive, onMounted } from 'vue';
import TimeInput from './components/TimeInput.vue';
import DaySelector from './components/DaySelector.vue';
import DayOfMonthSelector from './components/DayOfMonthSelector.vue';
import MonthSelector from './components/MonthSelector.vue';
import EveryNSelector from './components/EveryNSelector.vue';
import CronInput from './components/CronInput.vue';
import SchedulePreview from './components/SchedulePreview.vue';
import { 
getScheduleDescription, 
getNextOccurrences, 
validateSchedule, 
formatTimeString, 
parseTimeString 
} from './utils/scheduleUtils';

export default {
components: {
TimeInput,
DaySelector,
DayOfMonthSelector,
MonthSelector,
EveryNSelector,
CronInput,
SchedulePreview
},
props: {
content: {
type: Object,
required: true
},
uid: {
type: String,
required: true
},
},
emits: ['trigger-event'],
setup(props, { emit }) {
// Editor state
const isEditing = computed(() => {
// eslint-disable-next-line no-unreachable
return false;
});

// Initialize internal value
const { value: internalValue, setValue: setInternalValue } = wwLib.wwVariable.useComponentVariable({
uid: props.uid,
name: 'value',
type: 'object',
defaultValue: computed(() => props.content.value || {
mode: 'Daily',
time: '00:00',
localTime: '00:00',
daysOfWeek: [3], // Default to Wednesday (3)
day: '1',
month: '1',
everyN: { n: 1, unit: 'days' },
cronExpression: ''
})
});

// Get props with defaults
const timezone = computed(() => props.content.timezone || 'America/New_York');
const disabled = computed(() => props.content.disabled || false);

// Available tabs
const tabs = [
{ id: 'Daily', label: 'Daily' },
{ id: 'Weekly', label: 'Weekly' },
{ id: 'Bi-weekly', label: 'Bi-weekly' },
{ id: 'Monthly', label: 'Monthly' },
{ id: 'Bi-monthly', label: 'Bi-monthly' },
{ id: 'Six-monthly', label: 'Six-monthly' },
{ id: 'Annually', label: 'Annually' },
{ id: 'Every N', label: 'Every N' },
{ id: 'Cron', label: 'Cron' }
];

// Current tab (mode)
const currentTab = ref(internalValue.value?.mode || 'Daily');

// Schedule state
const scheduleState = reactive({
time: internalValue.value?.time || '00:00',
skipWeekends: internalValue.value?.skipWeekends || false,
daysOfWeek: internalValue.value?.daysOfWeek || [3], // Default to Wednesday (3)
day: internalValue.value?.day || '1',
month: internalValue.value?.month || '1',
everyN: internalValue.value?.everyN || { n: 1, unit: 'days' },
cronExpression: internalValue.value?.cronExpression || ''
});

// Validation state
const errors = reactive({});
const isValid = ref(true);
const isCronValid = ref(true);

// Computed properties
const showTimeForEveryN = computed(() => {
return scheduleState.everyN?.unit === 'days';
});

// Current schedule object
const currentSchedule = computed(() => {
return {
mode: currentTab.value,
time: scheduleState.time,
skipWeekends: scheduleState.skipWeekends,
daysOfWeek: scheduleState.daysOfWeek,
day: scheduleState.day,
month: scheduleState.month,
everyN: scheduleState.everyN,
cronExpression: scheduleState.cronExpression
};
});

// Schedule description and next runs
const scheduleDescription = computed(() => {
return getScheduleDescription(currentSchedule.value, timezone.value);
});

const nextRuns = computed(() => {
return getNextOccurrences(currentSchedule.value, timezone.value, 5);
});

// Methods
const setTab = (tabId) => {
currentTab.value = tabId;
validateCurrentSchedule();
emitChange();
};

const updateSkipWeekends = (value) => {
scheduleState.skipWeekends = value;
emitChange();
};

const updateCronValidity = (valid) => {
isCronValid.value = valid;
validateCurrentSchedule();
};

const validateCurrentSchedule = () => {
const { isValid: valid, errors: validationErrors } = validateSchedule(currentSchedule.value);
Object.assign(errors, validationErrors);
isValid.value = valid;
emitValidityChange(valid, validationErrors);
};

const emitChange = () => {
const newValue = { ...currentSchedule.value };
setInternalValue(newValue);
emit('trigger-event', {
name: 'change',
event: { value: newValue }
});
};

const emitValidity = () => {
emitValidityChange(isValid.value, errors);
};

const emitValidityChange = (valid, validationErrors) => {
emit('trigger-event', {
name: 'validityChange',
event: { isValid: valid, errors: validationErrors }
});
};

// Watch for external value changes
watch(() => props.content.value, (newValue) => {
if (newValue) {
// Update current tab
if (newValue.mode) {
currentTab.value = newValue.mode;
}

// Update schedule state
if (newValue.time) {
scheduleState.time = newValue.time;
}
if (typeof newValue.skipWeekends === 'boolean') {
scheduleState.skipWeekends = newValue.skipWeekends;
}
if (Array.isArray(newValue.daysOfWeek)) {
scheduleState.daysOfWeek = [...newValue.daysOfWeek];
}
if (newValue.day) {
scheduleState.day = newValue.day;
}
if (newValue.month) {
scheduleState.month = newValue.month;
}
if (newValue.everyN) {
scheduleState.everyN = { ...newValue.everyN };
}
if (newValue.cronExpression !== undefined) {
scheduleState.cronExpression = newValue.cronExpression;
}

// Validate the new schedule
validateCurrentSchedule();
}
}, { deep: true });

// Watch for internal state changes
watch(scheduleState, () => {
validateCurrentSchedule();
emitChange();
}, { deep: true });

// Ensure single day selection for Weekly and Bi-weekly modes
watch(currentTab, (newTab) => {
if ((newTab === 'Weekly' || newTab === 'Bi-weekly') && scheduleState.daysOfWeek.length > 1) {
// If multiple days are selected, keep only the first one
scheduleState.daysOfWeek = [scheduleState.daysOfWeek[0]];
}
});

// Initialize validation on mount
onMounted(() => {
validateCurrentSchedule();
});

return {
currentTab,
tabs,
scheduleState,
timezone,
disabled,
errors,
isValid,
showTimeForEveryN,
scheduleDescription,
nextRuns,
setTab,
updateSkipWeekends,
updateCronValidity,
internalValue
};
}
};
</script>

<style lang="scss" scoped>
.cron-schedule-builder {
font-family: inherit;
color: #333;
width: 100%;

&.disabled {
opacity: 0.7;
pointer-events: none;
}
}

.schedule-tabs {
display: flex;
flex-wrap: wrap;
gap: 4px;
margin-bottom: 16px;
border-bottom: 1px solid #ddd;
}

.schedule-tab {
padding: 8px 12px;
cursor: pointer;
border-radius: 4px 4px 0 0;
font-size: 14px;
transition: all 0.2s ease;

&:hover {
background-color: #f0f0f0;
}

&.active {
background-color: #265298;
color: white;
}
}

.schedule-content {
padding: 16px 0;
}

.tab-content {
margin-bottom: 16px;
}

.form-group {
margin-bottom: 16px;

label {
display: block;
margin-bottom: 8px;
font-weight: 500;
font-size: 14px;
}
}

.checkbox-label {
display: flex;
align-items: center;
cursor: pointer;

input[type="checkbox"] {
margin-right: 8px;
}
}

.help-text {
font-size: 12px;
color: #666;
margin-top: 4px;
}

.error-message {
color: #e53935;
font-size: 12px;
margin-top: 4px;
}

input:focus,
select:focus,
.time-input-fields:focus-within {
border-color: #265298;
box-shadow: 0 0 0 2px rgba(38, 82, 152, 0.2);
}
</style>