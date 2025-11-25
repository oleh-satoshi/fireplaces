export default {
editor: {
label: {
en: 'Cron Schedule Builder',
es: 'Constructor de Programación Cron'
},
icon: 'calendar'
},
properties: {
value: {
label: {
en: 'Initial value',
es: 'Valor inicial'
},
type: 'Object',
section: 'settings',
bindable: true,
defaultValue: {
mode: 'Daily',
time: '00:00',
daysOfWeek: [1, 2, 3, 4, 5],
day: '1',
month: '1',
everyN: { n: 1, unit: 'days' },
cronExpression: ''
},
},
timezone: {
label: {
en: 'Timezone',
es: 'Zona horaria'
},
type: 'Text',
section: 'settings',
bindable: true,
defaultValue: 'America/New_York',
},
disabled: {
label: {
en: 'Disabled',
es: 'Deshabilitado'
},
type: 'OnOff',
section: 'settings',
bindable: true,
defaultValue: false,
}
},
triggerEvents: [
{
name: 'change',
label: {
en: 'On change',
es: 'Al cambiar'
},
event: {
value: {}
}
},
{
name: 'validityChange',
label: {
en: 'On validity change',
es: 'Al cambiar validez'
},
event: {
isValid: true,
errors: {}
}
}
]
};