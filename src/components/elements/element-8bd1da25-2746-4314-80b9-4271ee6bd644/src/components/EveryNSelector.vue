<template>
<div class="every-n-selector">
<div class="every-n-inputs">
<div class="input-group">
<label for="every-n-value">Every</label>
<input
id="every-n-value"
type="number"
class="n-input"
:value="n"
@input="updateN($event.target.value)"
min="1"
:disabled="disabled"
/>
</div>

<div class="input-group">
<label for="every-n-unit">Unit</label>
<select
id="every-n-unit"
class="unit-select"
:value="unit"
@change="updateUnit($event.target.value)"
:disabled="disabled"
>
<option v-for="unitOption in unitOptions" :key="unitOption.value" :value="unitOption.value">
{{ unitOption.label }}
</option>
</select>
</div>
</div>

<div v-if="showError" class="error-message">
Value must be at least 1
</div>
</div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
name: 'EveryNSelector',
props: {
modelValue: {
type: Object,
default: () => ({ n: 1, unit: 'days' })
},
disabled: {
type: Boolean,
default: false
}
},
emits: ['update:modelValue'],
setup(props, { emit }) {
const n = ref(props.modelValue?.n || 1);
const unit = ref(props.modelValue?.unit || 'days');
const showError = ref(false);

const unitOptions = [
{ value: 'minutes', label: 'Minutes' },
{ value: 'hours', label: 'Hours' },
{ value: 'days', label: 'Days' }
];

const updateN = (value) => {
const numValue = parseInt(value, 10);
if (!isNaN(numValue)) {
n.value = numValue;
showError.value = numValue < 1;
emit('update:modelValue', { n: numValue, unit: unit.value });
}
};

const updateUnit = (value) => {
unit.value = value;
emit('update:modelValue', { n: n.value, unit: value });
};

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
if (newValue) {
n.value = newValue.n || 1;
unit.value = newValue.unit || 'days';
}
}, { deep: true });

return {
n,
unit,
unitOptions,
showError,
updateN,
updateUnit
};
}
};
</script>

<style scoped>
.every-n-selector {
margin-bottom: 16px;
}

.every-n-inputs {
display: flex;
gap: 16px;
align-items: flex-end;
}

.input-group {
display: flex;
flex-direction: column;
}

.input-group label {
font-size: 12px;
margin-bottom: 4px;
color: #666;
}

.n-input {
width: 60px;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
font-size: 14px;
}

.unit-select {
min-width: 100px;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
font-size: 14px;
}

.n-input:focus,
.unit-select:focus {
border-color: #265298; /* Changed from #4a90e2 */
outline: none;
box-shadow: 0 0 0 2px rgba(38, 82, 152, 0.2); /* Changed from rgba(74, 144, 226, 0.2) */
}

.n-input:disabled,
.unit-select:disabled {
background-color: #f5f5f5;
cursor: not-allowed;
opacity: 0.7;
}

.error-message {
color: #e53935;
font-size: 12px;
margin-top: 4px;
}
</style>