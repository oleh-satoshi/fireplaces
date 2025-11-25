<template>
<div 
class="external-tooltip" 
ref="tooltipRef"
:style="{
backgroundColor: 'transparent',
position: 'relative'
}"
>
<div 
class="tooltip-wrapper" 
ref="tooltipWrapperRef"
:style="{
visibility: isVisible ? 'visible' : 'hidden',
opacity: isVisible ? 1 : 0,
position: 'fixed',
zIndex: 1000,
transition: 'opacity 0.2s'
}"
>
<div 
class="tooltip-content" 
:style="{
position: 'relative',
padding: padding,
borderRadius: '4px',
backgroundColor: backgroundColor,
color: textColor,
fontSize: fontSize,
maxWidth: 'none',
whiteSpace: 'nowrap'
}"
>
<div class="tooltip-text-wrapper" style="display: flex; align-items: center; gap: 6px;">
<div 
v-if="showIcon && iconHTML && iconPosition === 'start'" 
class="tooltip-icon" 
v-html="iconHTML"
:style="{ 
width: iconSize, 
height: iconSize,
display: 'flex',
alignItems: 'center',
justifyContent: 'center'
}"
></div>
<span class="tooltip-text" style="white-space: nowrap;">{{ tooltipContent }}</span>
<div 
v-if="showIcon && iconHTML && iconPosition === 'end'" 
class="tooltip-icon" 
v-html="iconHTML"
:style="{ 
width: iconSize, 
height: iconSize,
display: 'flex',
alignItems: 'center',
justifyContent: 'center'
}"
></div>
</div>
<div 
class="tooltip-tail" 
ref="tooltipTailRef"
:style="{
width: '8px',
height: '8px',
backgroundColor: backgroundColor,
position: 'absolute',
transform: 'rotate(45deg)',
zIndex: -1
}"
></div>
</div>
</div>
</div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

export default {
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
setup(props) {
// Editor state
const isEditing = computed(() => {
// eslint-disable-next-line no-unreachable
return false;
});

// Refs
const tooltipRef = ref(null);
const tooltipWrapperRef = ref(null);
const tooltipTailRef = ref(null);
const iconHTML = ref('');

// State
const isVisible = ref(false);
const targetElements = ref([]);
const currentTarget = ref(null);

// Computed properties
const targetSelector = computed(() => props.content?.targetSelector || '.mi-elemento');
const backgroundColor = computed(() => props.content?.backgroundColor || '#333333');
const textColor = computed(() => props.content?.textColor || '#ffffff');
const tooltipContent = computed(() => props.content?.tooltipContent || 'Tooltip content');
const position = computed(() => props.content?.position || 'auto');
const offset = computed(() => props.content?.offset || 10);
const padding = computed(() => props.content?.padding || '8px 12px');
const fontSize = computed(() => props.content?.fontSize || '14px');
const icon = computed(() => props.content?.icon);
const iconPosition = computed(() => props.content?.iconPosition || 'start');
const showIcon = computed(() => props.content?.showIcon !== false); // Default to true if undefined
const iconSize = computed(() => props.content?.iconSize || '16px');

// Icon handling
const { getIcon } = wwLib.useIcons();

// Watch for icon changes
watch(icon, async () => {
if (icon.value) {
try {
const iconSvg = await getIcon(icon.value);
if (iconSvg) {
// Process the SVG to ensure it respects the size
iconHTML.value = iconSvg;
} else {
iconHTML.value = '';
}
} catch (error) {
console.error('Error loading icon:', error);
iconHTML.value = '';
}
} else {
iconHTML.value = '';
}
}, { immediate: true });

// Event handlers - defined separately to allow proper removal
const handleMouseEnter = (event) => {
showTooltip(event.currentTarget);
};

const handleMouseLeave = () => {
hideTooltip();
};

// Methods
const initTooltip = () => {
if (isEditing.value) return;

// Clean up previous listeners
cleanupEventListeners();

// Find target elements
const document = wwLib.getFrontDocument();
if (!document) return;

try {
// Use a try-catch as querySelectorAll might throw with invalid selectors
const selector = targetSelector.value?.trim();
if (!selector) return;

targetElements.value = Array.from(document.querySelectorAll(selector));

// Add event listeners to targets
targetElements.value.forEach(target => {
target.addEventListener('mouseenter', handleMouseEnter);
target.addEventListener('mouseleave', handleMouseLeave);
});
} catch (error) {
console.error('Error selecting tooltip targets:', error);
}
};

const cleanupEventListeners = () => {
// Remove previous event listeners
if (targetElements.value.length) {
targetElements.value.forEach(target => {
target.removeEventListener('mouseenter', handleMouseEnter);
target.removeEventListener('mouseleave', handleMouseLeave);
});
targetElements.value = [];
}
};

const showTooltip = (target) => {
if (isEditing.value || !tooltipWrapperRef.value || !target) return;

currentTarget.value = target;
const targetRect = target.getBoundingClientRect();
isVisible.value = true;

// Position after next tick to ensure tooltip is visible for measurements
setTimeout(() => {
positionTooltip(targetRect);
}, 0);
};

const hideTooltip = () => {
if (isEditing.value) return;
isVisible.value = false;
currentTarget.value = null;
};

const calculateAvailableSpace = (targetRect) => {
const window = wwLib.getFrontWindow();
if (!window) return { top: 0, bottom: 0, left: 0, right: 0 };

return {
top: targetRect.top,
bottom: window.innerHeight - targetRect.bottom,
left: targetRect.left,
right: window.innerWidth - targetRect.right
};
};

const autoPosition = (space, tooltipWidth, tooltipHeight, targetRect) => {
const window = wwLib.getFrontWindow();
if (!window) return 'top';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

// Check if element is near screen edges
const isNearLeftEdge = targetRect.left < tooltipWidth + offset.value;
const isNearRightEdge = windowWidth - targetRect.right < tooltipWidth + offset.value;
const isNearTopEdge = targetRect.top < tooltipHeight + offset.value;
const isNearBottomEdge = windowHeight - targetRect.bottom >= tooltipHeight + offset.value;

// Calculate if each position has enough space
const positions = {
top: targetRect.top >= tooltipHeight + offset.value,
bottom: windowHeight - targetRect.bottom >= tooltipHeight + offset.value,
left: targetRect.left >= tooltipWidth + offset.value,
right: windowWidth - targetRect.right >= tooltipWidth + offset.value
};

// If user specified a position and it's valid, use it
if (position.value !== 'auto' && positions[position.value]) {
return position.value;
}

// For auto positioning, prioritize bottom if top doesn't have enough space
if (isNearTopEdge && positions.bottom) {
return 'bottom';
}

// Handle other edge cases
if (isNearLeftEdge && positions.right) {
return 'right';
} else if (isNearRightEdge && positions.left) {
return 'left';
} else if (isNearBottomEdge && positions.top) {
return 'top';
}

// Default preferred positions in order - prioritize bottom over top
const preferredOrder = ['bottom', 'top', 'right', 'left'];

// Find the first valid position
for (const pos of preferredOrder) {
if (positions[pos]) return pos;
}

// If no position has enough space, choose the one with the most space
const spaces = {
top: space.top,
bottom: space.bottom,
left: space.left,
right: space.right
};

let maxSpace = 0;
let bestPosition = 'bottom'; // Default to bottom instead of top

for (const [pos, spaceAmount] of Object.entries(spaces)) {
if (spaceAmount > maxSpace) {
maxSpace = spaceAmount;
bestPosition = pos;
}
}

return bestPosition;
};

const positionTooltip = (targetRect) => {
if (!tooltipWrapperRef.value || !tooltipTailRef.value) return;

const tooltipWrapper = tooltipWrapperRef.value;
const tooltipTail = tooltipTailRef.value;


// First make the tooltip visible to get its dimensions
tooltipWrapper.style.visibility = 'visible';
tooltipWrapper.style.opacity = '0';


// Get dimensions after tooltip is visible
const tooltipRect = tooltipWrapper.getBoundingClientRect();
const tooltipWidth = tooltipRect.width;
const tooltipHeight = tooltipRect.height;

const space = calculateAvailableSpace(targetRect);
const tooltipPosition = autoPosition(space, tooltipWidth, tooltipHeight, targetRect);

const window = wwLib.getFrontWindow();
if (!window) return;

const windowWidth = window.innerWidth;

// Reset transform
tooltipWrapper.style.transform = '';

// Position based on available space
switch (tooltipPosition) {
case 'top':
// Center horizontally
let topX = targetRect.left + (targetRect.width / 2);

// Adjust if too close to left edge
if (topX - tooltipWidth / 2 < 0) {
topX = tooltipWidth / 2 + 5; // 5px buffer
}

// Adjust if too close to right edge
if (topX + tooltipWidth / 2 > windowWidth) {
topX = windowWidth - tooltipWidth / 2 - 5; // 5px buffer
}

tooltipWrapper.style.left = `${topX}px`;
tooltipWrapper.style.top = `${targetRect.top - tooltipHeight - offset.value}px`;
tooltipWrapper.style.transform = 'translateX(-50%)';

// Position tail
tooltipTail.style.left = '50%';
tooltipTail.style.top = '';
tooltipTail.style.bottom = '-4px';
tooltipTail.style.right = '';
tooltipTail.style.transform = 'translateX(-50%) rotate(45deg)';

// Adjust tail if tooltip position was adjusted for edges
if (topX !== targetRect.left + (targetRect.width / 2)) {
const tailOffset = targetRect.left + (targetRect.width / 2) - topX;
const tailPosition = 50 + (tailOffset / tooltipWidth * 100);
tooltipTail.style.left = `${Math.min(Math.max(tailPosition, 10), 90)}%`; // Keep between 10% and 90%
}
break;

case 'bottom':
// Center horizontally
let bottomX = targetRect.left + (targetRect.width / 2);

// Adjust if too close to left edge
if (bottomX - tooltipWidth / 2 < 0) {
bottomX = tooltipWidth / 2 + 5; // 5px buffer
}

// Adjust if too close to right edge
if (bottomX + tooltipWidth / 2 > windowWidth) {
bottomX = windowWidth - tooltipWidth / 2 - 5; // 5px buffer
}

tooltipWrapper.style.left = `${bottomX}px`;
tooltipWrapper.style.top = `${targetRect.bottom + offset.value}px`;
tooltipWrapper.style.transform = 'translateX(-50%)';

// Position tail
tooltipTail.style.left = '50%';
tooltipTail.style.top = '-4px';
tooltipTail.style.bottom = '';
tooltipTail.style.right = '';
tooltipTail.style.transform = 'translateX(-50%) rotate(45deg)';

// Adjust tail if tooltip position was adjusted for edges
if (bottomX !== targetRect.left + (targetRect.width / 2)) {
const tailOffset = targetRect.left + (targetRect.width / 2) - bottomX;
const tailPosition = 50 + (tailOffset / tooltipWidth * 100);
tooltipTail.style.left = `${Math.min(Math.max(tailPosition, 10), 90)}%`; // Keep between 10% and 90%
}
break;

case 'left':
// Center vertically
let leftY = targetRect.top + (targetRect.height / 2);

tooltipWrapper.style.left = `${targetRect.left - tooltipWidth - offset.value}px`;
tooltipWrapper.style.top = `${leftY}px`;
tooltipWrapper.style.transform = 'translateY(-50%)';

// Position tail
tooltipTail.style.right = '-4px';
tooltipTail.style.left = '';
tooltipTail.style.top = '50%';
tooltipTail.style.bottom = '';
tooltipTail.style.transform = 'translateY(-50%) rotate(45deg)';
break;

case 'right':
// Center vertically
let rightY = targetRect.top + (targetRect.height / 2);

tooltipWrapper.style.left = `${targetRect.right + offset.value}px`;
tooltipWrapper.style.top = `${rightY}px`;
tooltipWrapper.style.transform = 'translateY(-50%)';

// Position tail
tooltipTail.style.left = '-4px';
tooltipTail.style.right = '';
tooltipTail.style.top = '50%';
tooltipTail.style.bottom = '';
tooltipTail.style.transform = 'translateY(-50%) rotate(45deg)';
break;
}

// Make tooltip fully visible
tooltipWrapper.style.opacity = '1';
};

// Watch for changes to reinitialize tooltip
watch([targetSelector, isEditing], () => {
if (isEditing.value) {
cleanupEventListeners();
} else {
initTooltip();
}
}, { immediate: true });

// Watch for content changes to update tooltip if visible
watch([tooltipContent, backgroundColor, textColor, position, offset, iconSize], () => {
if (isVisible.value && currentTarget.value) {
const targetRect = currentTarget.value.getBoundingClientRect();
positionTooltip(targetRect);
}
});

// Handle window resize
const handleResize = () => {
if (isVisible.value && currentTarget.value) {
const targetRect = currentTarget.value.getBoundingClientRect();
positionTooltip(targetRect);
}
};

// Lifecycle hooks
onMounted(() => {
const window = wwLib.getFrontWindow();
if (window) {
window.addEventListener('resize', handleResize);
}

// Initialize after a short delay to ensure DOM is fully loaded
setTimeout(() => {
initTooltip();
}, 100);
});

onBeforeUnmount(() => {
cleanupEventListeners();
const window = wwLib.getFrontWindow();
if (window) {
window.removeEventListener('resize', handleResize);
}
});

return {
tooltipRef,
tooltipWrapperRef,
tooltipTailRef,
isVisible,
backgroundColor,
textColor,
tooltipContent,
isEditing,
padding,
fontSize,
iconHTML,
iconPosition,
showIcon,
iconSize
};
}
};
</script>

<style scoped>
.tooltip-icon :deep(svg) {
width: 100%;
height: 100%;
}
</style>