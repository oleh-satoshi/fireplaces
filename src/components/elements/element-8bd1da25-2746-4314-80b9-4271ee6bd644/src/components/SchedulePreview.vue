<template>
<div class="schedule-preview">
<div class="preview-header">Schedule Preview</div>

<div class="schedule-description">
{{ description }}
</div>

<div class="next-runs-container">
<div class="next-runs-header">Next 5 runs:</div>
<div v-if="nextRuns.length > 0" class="next-runs-list">
<div v-for="(run, index) in nextRuns" :key="index" class="next-run-item">
{{ formatDate(run) }}
</div>
</div>
<div v-else class="no-runs-message">
{{ noRunsMessage }}
</div>
</div>
</div>
</template>

<script>
import { computed } from 'vue';

export default {
name: 'SchedulePreview',
props: {
description: {
type: String,
default: 'No schedule configured'
},
nextRuns: {
type: Array,
default: () => []
},
timezone: {
type: String,
default: 'America/New_York'
},
isValid: {
type: Boolean,
default: true
}
},
setup(props) {
const noRunsMessage = computed(() => {
if (!props.isValid) {
return 'Invalid schedule configuration';
}
return 'No upcoming runs calculated';
});

const formatDate = (date) => {
if (!date) return '';

try {
const options = { 
timeZone: props.timezone,
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

return {
noRunsMessage,
formatDate
};
}
};
</script>

<style scoped>
.schedule-preview {
background-color: #f5f5f5;
border-radius: 4px;
padding: 16px;
}

.preview-header {
font-weight: 600;
font-size: 16px;
margin-bottom: 12px;
color: #333;
}

.schedule-description {
margin-bottom: 16px;
font-size: 14px;
}

.next-runs-header {
font-weight: 500;
margin-bottom: 8px;
font-size: 14px;
}

.next-runs-list {
display: flex;
flex-direction: column;
gap: 4px;
}

.next-run-item {
font-size: 13px;
padding: 4px 8px;
background-color: #e0e0e0;
border-radius: 4px;
}

.no-runs-message {
font-size: 13px;
color: #666;
font-style: italic;
}
</style>