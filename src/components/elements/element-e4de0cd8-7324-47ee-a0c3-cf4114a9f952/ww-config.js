export default {
editor: {
label: {
en: 'External Tooltip'
},
icon: 'chat'
},
properties: {
targetSelector: {
label: { en: 'Target Selector' },
type: 'Text',
section: 'settings',
bindable: true,
defaultValue: '.mi-elemento',
},
tooltipContent: {
label: { en: 'Tooltip Content' },
type: 'Text',
section: 'settings',
bindable: true,
defaultValue: 'This is a tooltip',
},
position: {
label: { en: 'Preferred Position' },
type: 'TextSelect',
section: 'settings',
bindable: true,
defaultValue: 'auto',
options: {
options: [
{ value: 'auto', label: 'Auto (Best fit)' },
{ value: 'top', label: 'Top' },
{ value: 'bottom', label: 'Bottom' },
{ value: 'left', label: 'Left' },
{ value: 'right', label: 'Right' }
]
},
},
offset: {
label: { en: 'Distance from Target' },
type: 'Number',
section: 'settings',
bindable: true,
defaultValue: 10,
options: {
min: 0,
max: 50,
step: 1
},
},
backgroundColor: {
label: { en: 'Background Color' },
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#333333',
},
textColor: {
label: { en: 'Text Color' },
type: 'Color',
section: 'style',
bindable: true,
defaultValue: '#ffffff',
},
padding: {
label: { en: 'Padding' },
type: 'Length',
section: 'style',
bindable: true,
defaultValue: '8px 12px',
},
fontSize: {
label: { en: 'Font Size' },
type: 'Length',
section: 'style',
bindable: true,
defaultValue: '14px',
},
icon: {
label: { en: 'Icon' },
type: 'SystemIcon',
section: 'settings',
bindable: true,
defaultValue: null,
},
showIcon: {
label: { en: 'Show Icon' },
type: 'OnOff',
section: 'settings',
bindable: true,
defaultValue: true,
},
iconSize: {
label: { en: 'Icon Size' },
type: 'Length',
section: 'settings',
bindable: true,
defaultValue: '16px',
},
iconPosition: {
label: { en: 'Icon Position' },
type: 'TextRadioGroup',
section: 'settings',
bindable: true,
defaultValue: 'start',
options: {
choices: [
{ value: 'start', title: 'Start', icon: 'align-left' },
{ value: 'end', title: 'End', icon: 'align-right' }
]
},
}
}
};