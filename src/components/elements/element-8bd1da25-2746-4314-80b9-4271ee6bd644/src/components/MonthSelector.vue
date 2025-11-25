<template>
<div class="month-selector">
<select
class="month-select"
:value="modelValue"
@change="updateMonth($event.target.value)"
:disabled="disabled"
>
<option v-for="month in months" :key="month.value" :value="month.value">
{{ month.label }}
</option>
</select>
</div>
</template>

<script>
export default {
name: 'MonthSelector',
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
const months = [
{ value: '1', label: 'January' },
{ value: '2', label: 'February' },
{ value: '3', label: 'March' },
{ value: '4', label: 'April' },
{ value: '5', label: 'May' },
{ value: '6', label: 'June' },
{ value: '7', label: 'July' },
{ value: '8', label: 'August' },
{ value: '9', label: 'September' },
{ value: '10', label: 'October' },
{ value: '11', label: 'November' },
{ value: '12', label: 'December' }
];

const updateMonth = (value) => {
emit('update:modelValue', value);
};

return {
months,
updateMonth
};
}
};
</script>

<style scoped>
.month-selector {
margin-bottom: 16px;
}

.month-select {
width: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 4px;
background-color: #fff;
font-size: 14px;
}

.month-select:focus {
border-color: #265298; /* Changed from #4a90e2 */
outline: none;
box-shadow: 0 0 0 2px rgba(38, 82, 152, 0.2); /* Changed from rgba(74, 144, 226, 0.2) */
}

.month-select:disabled {
background-color: #f5f5f5;
cursor: not-allowed;
opacity: 0.7;
}
</style>