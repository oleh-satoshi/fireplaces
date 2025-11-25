<template>
<div class="cron-input">
<div class="input-container">
<input
type="text"
class="cron-expression-input"
:value="modelValue"
@input="updateCron($event.target.value)"
:disabled="disabled"
placeholder="* * * * *"
aria-label="Cron expression"
/>
</div>

<div class="cron-help">
<div class="help-title">Format: <code>minute hour day-of-month month day-of-week</code></div>
<div class="help-examples">
<div>Examples:</div>
<div><code>0 5 * * 1-5</code> - At 5:00 AM, Monday through Friday</div>
<div><code>*/15 9-17 * * 1-5</code> - Every 15 minutes, 9 AM - 5 PM, weekdays</div>
<div><code>0 0 1 * *</code> - At midnight on the first day of every month</div>
</div>
</div>

<div v-if="showError" class="error-message">
Invalid cron expression
</div>
</div>
</template>

<script>
import { ref, watch } from 'vue';
import { validateCronExpression } from '../utils/scheduleUtils';

export default {
name: 'CronInput',
props: {
modelValue: {
type: String,
default: ''
},
disabled: {
type: Boolean,
default: false
}
},
emits: ['update:modelValue', 'validity-change'],
setup(props, { emit }) {
const showError = ref(false);

const updateCron = (value) => {
emit('update:modelValue', value);
const isValid = validateCronExpression(value);
showError.value = value && !isValid;
emit('validity-change', isValid);
};

// Validate initial value
watch(() => props.modelValue, (newValue) => {
if (newValue) {
const isValid = validateCronExpression(newValue);
showError.value = !isValid;
emit('validity-change', isValid);
} else {
showError.value = false;
emit('validity-change', false);
}
}, { immediate: true });

return {
showError,
updateCron
};
}
};
</script>

<style scoped>
.cron-input {
margin-bottom: 16px;
}

.input-container {
margin-bottom: 8px;
}

.cron-expression-input {
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
font-size: 14px;
font-family: monospace;
}

.cron-expression-input:focus {
border-color: #265298; /* Changed from #4a90e2 */
outline: none;
box-shadow: 0 0 0 2px rgba(38, 82, 152, 0.2); /* Changed from rgba(74, 144, 226, 0.2) */
}

.cron-expression-input:disabled {
background-color: #f5f5f5;
cursor: not-allowed;
opacity: 0.7;
}

.cron-help {
background-color: #f5f5f5;
border-radius: 4px;
padding: 8px;
font-size: 12px;
margin-bottom: 8px;
}

.help-title {
font-weight: 500;
margin-bottom: 4px;
}

.help-examples {
color: #666;
}

code {
font-family: monospace;
background-color: #e0e0e0;
padding: 2px 4px;
border-radius: 2px;
}

.error-message {
color: #e53935;
font-size: 12px;
}
</style>