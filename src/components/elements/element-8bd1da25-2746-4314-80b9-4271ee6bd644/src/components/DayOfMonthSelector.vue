<template>
<div class="day-of-month-selector">
<select
class="day-select"
:value="modelValue"
@change="updateDay($event.target.value)"
:disabled="disabled"
>
<option value="First">First day</option>
<option v-for="day in days" :key="day" :value="String(day)">
{{ day }}
</option>
<option value="Last">Last day</option>
</select>
</div>
</template>

<script>
export default {
name: 'DayOfMonthSelector',
props: {
modelValue: {
type: String,
default: '1'
},
disabled: {
type: Boolean,
default: false
}
},
emits: ['update:modelValue'],
setup(props, { emit }) {
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const updateDay = (value) => {
emit('update:modelValue', value);
};

return {
days,
updateDay
};
}
};
</script>

<style scoped>
.day-of-month-selector {
margin-bottom: 16px;
}

.day-select {
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
background-color: #fff;
font-size: 14px;
}

.day-select:focus {
border-color: #265298; /* Changed from #4a90e2 */
outline: none;
box-shadow: 0 0 0 2px rgba(38, 82, 152, 0.2); /* Changed from rgba(74, 144, 226, 0.2) */
}

.day-select:disabled {
background-color: #f5f5f5;
cursor: not-allowed;
opacity: 0.7;
}
</style>