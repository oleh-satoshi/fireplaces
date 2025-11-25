export default {
  editor: {
    label: { en: "PrimeVue Slider" },
  },
  triggerEvents: [
    { name: 'change', label: { en: 'On change' }, event: { value: '' }, default: true },
    { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '' } },
  ],
  properties: {
    isRange: {
      label: { en: "Dual Slider?" },
      type: "OnOff",
      defaultValue: true
    },
    value: {
      label: { en: "Init Value" },
      type: content => content.isRange ? "Array" : "Number",  // Dynamically set type
      defaultValue: content => content.isRange ? [20, 60] : 30, // Dynamic default
      options: content => ({
        min: Number(content.min) || 0,
        max: Number(content.max) || 100,
        noRange: !content.isRange, // If not range mode, treat as single value
      }),
      bindable: true,
    },
    min: {
      label: { en: "Min" },
      type: "Number",
      defaultValue: 0,
      bindable: true,
    },
    max: {
      label: { en: "Max" },
      type: "Number",
      defaultValue: 100,
      bindable: true,
    },
    step: {
      label: { en: "Step" },
      type: "Number",
      defaultValue: 1,
      bindable: true,
    },
    isLimits:{
      label: { en: "Show limits?" },
      type: "OnOff",
      defaultValue: false,
      bindable: true
    },
    isTooltip: {
      label: { en: 'Tooltip', fr: 'Tooltip' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true
    },
    isEditableTooltip: {
      label: { en: 'Editable Tooltip', fr: 'Editable Tooltip' },
      type: 'OnOff',
      defaultValue: false,
      bindable: true
    },
    isLogScale: {
      label: { en: 'Log Scale', fr: 'Log Scale' },
      type: 'OnOff',
      defaultValue: false,
      bindable: true
    },
    logStep: {
      label: { en: 'Log Step', fr: 'Log Step' },
      type: 'Number',
      defaultValue: 0.01,
      bindable: true
    },
    logDecimalPoints: {
      label: { en: 'Log Decimal Points', fr: 'Log Decimal Points' },
      type: 'Number',
      defaultValue: 0,
      bindable: true
    },
    globalStyle: {
      type: 'Object',
      options: {
          item: {
              fontSize: {
                  type: 'Length',
                  label: { en: 'Font size', fr: 'Taille du texte' },
                  options: {
                      unitChoices: [
                          { value: 'px', label: 'px', min: 10, max: 50 },
                          { value: 'em', label: 'em', min: 1, max: 50 },
                          { value: 'rem', label: 'rem', min: 1, max: 50 },
                      ],
                  },
                  hidden: ({ isTooltip }) => !isTooltip,
              },
              fontFamily: {
                  type: 'FontFamily',
                  label: { en: 'Font family', fr: 'Font' },
                  hidden: ({ isTooltip }) => !isTooltip,
              },
              limitBackgroundColor: {
                  label: { en: 'Limit background', fr: 'Limit background' },
                  type: 'Color',
                  bindable: true,
                  hidden: ({ isLimits }) => !isLimits
              },
              limitTextColor: {
                  label: { en: 'Limit text', fr: 'Limit texte' },
                  type: 'Color',
                  bindable: true,
                  hidden: ({ isLimits }) => !isLimits
              },
              rangeBackgroundColor: {
                  label: { en: 'Range background', fr: 'Range background' },
                  type: 'Color',
                  bindable: true,
              },
              selectorBorderColor: {
                  label: { en: 'Selector border', fr: 'Selector border' },
                  type: 'Color',
                  bindable: true,
              },
              tooltipBackground: {
                  label: { en: 'Tooltip background', fr: 'Tooltip background' },
                  type: 'Color',
                  hidden: ({ isTooltip }) => !isTooltip,
              },
              tooltipTextColor: {
                  label: { en: 'Tooltip text', fr: 'Tooltip texte' },
                  type: 'Color',
                  hidden: ({ isTooltip }) => !isTooltip,
              },
          },
      },
      responsive: true,
      states: true,
      classes: true,
      defaultValue: {
          fontSize: '15px',
          fontFamily: '',
          limitBackgroundColor: 'rgb(2, 6, 23)',
          limitTextColor: 'rgb(255, 255, 255)',
          rangeBackgroundColor: 'rgb(2, 6, 23)', //done
          selectorBorderColor: 'rgb(226, 232, 240)', //done
          tooltipBackground: 'rgba(0, 0, 0, 0)',
          tooltipTextColor: 'rgb(0, 0, 0)',
      },
    },
  },
};