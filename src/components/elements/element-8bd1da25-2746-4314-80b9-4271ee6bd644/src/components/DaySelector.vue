<template>
<div class="day-selector">
<div class="day-buttons">
<button
v-for="day in days"
:key="day.value"
type="button"
class="day-button"
:class="{ selected: isSelected(day.value) }"
@click="toggleDay(day.value)"
:disabled="disabled"
:aria-pressed="isSelected(day.value)"
>
{{ day.label }}
</button>
</div>

<div class="quick-selectors">
<!-- <button
type="button"
class="quick-selector-button"
@click="selectWeekdays"
:disabled="disabled"
>
Weekdays
</button>
<button
type="button"
class="quick-selector-button"
@click="selectWeekends"
:disabled="disabled"
>
Weekends
</button>
<button
type="button"
class="quick-selector-button"
@click="selectAll"
:disabled="disabled"
>
All
</button> -->
</div>
</div>
</template>

<script>
import { computed } from 'vue';

export default {
name: 'DaySelector',
props: {
modelValue: {
type: Array,
default: () => []
},
disabled: {
type: Boolean,
default: false
},
singleSelection: {
type: Boolean,
default: true
}
},
emits: ['update:modelValue'],
setup(props, { emit }) {
const days = [
{ label: 'M', value: 1 },
{ label: 'T', value: 2 },
{ label: 'W', value: 3 },
{ label: 'T', value: 4 },
{ label: 'F', value: 5 },
{ label: 'S', value: 6 },
{ label: 'S', value: 7 }
];

const isSelected = (value) => {
return props.modelValue.includes(value);
};

const toggleDay = (value) => {
if (props.disabled) return;

let newValue;
if (props.singleSelection) {
// If single selection mode, replace the array with just this day
newValue = [value];
} else {
// Otherwise toggle the day
newValue = [...props.modelValue];
const index = newValue.indexOf(value);
if (index === -1) {
newValue.push(value);
} else {
newValue.splice(index, 1);
}
}

emit('update:modelValue', newValue);
};

const selectWeekdays = () => {
if (props.disabled) return;
emit('update:modelValue', props.singleSelection ? [1] : [1, 2, 3, 4, 5]);
};

const selectWeekends = () => {
if (props.disabled) return;
emit('update:modelValue', props.singleSelection ? [6] : [6, 7]);
};

const selectAll = () => {
if (props.disabled) return;
emit('update:modelValue', props.singleSelection ? [1] : [1, 2, 3, 4, 5, 6, 7]);
};

return {
days,
isSelected,
toggleDay,
selectWeekdays,
selectWeekends,
selectAll
};
}
};
</script>

<style scoped>
.day-selector {
margin-bottom: 16px;
}

.day-buttons {
display: flex;
gap: 4px;
margin-bottom: 8px;
}

.day-button {
width: 36px;
height: 36px;
border-radius: 8px; /* Changed from 50% (circle) to 8px (rounded square) */
border: 1px solid #ccc;
background-color: #fff;
cursor: pointer;
font-weight: 500;
transition: all 0.2s ease;
display: flex; /* Added to center the text */
align-items: center; /* Added to center the text vertically */
justify-content: center; /* Added to center the text horizontally */
}

.day-button.selected {
background-color: #265298; /* Changed from #4a90e2 to #265298 */
color: white;
border-color: #265298; /* Changed from #4a90e2 to #265298 */
}

.day-button:hover:not(:disabled):not(.selected) {
background-color: #f0f0f0;
}

.day-button:disabled {
opacity: 0.5;
cursor: not-allowed;
}

.quick-selectors {
display: flex;
gap: 8px;
}

.quick-selector-button {
padding: 4px 8px;
border-radius: 16px;
border: 1px solid #ccc;
background-color: #f5f5f5;
font-size: 12px;
cursor: pointer;
transition: all 0.2s ease;
}

.quick-selector-button:hover:not(:disabled) {
background-color: #e0e0e0;
}

.quick-selector-button:disabled {
opacity: 0.5;
cursor: not-allowed;
}
</style>