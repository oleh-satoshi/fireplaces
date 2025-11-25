<template>
  <div class="fl-ww-pv-slider">
    
    <!-- Wrapper for Tooltips & Slider (Ensures They Stay Aligned) -->
    <div class="fl-ww-pv-slider__wrapper">
      
      <!-- Min Badge (Before Slider) -->
      <Badge
        v-if="content.isLimits"
        class="fl-ww-pv-slider__badge fl-ww-pv-slider__badge--left"
        :value="content.min"
        :pt="{
          root:{
            style:{
              'background-color':this.content.globalStyle.limitBackgroundColor,
              'color':this.content.globalStyle.limitTextColor
            }
          }
        }"
      />

      <div class="fl-ww-pv-slider__slider-container">
        
        <!-- Tooltips for Single & Range Sliders -->
        <div 
          v-if="content.isTooltip && !isRange" 
          :style="[tooltipStyle, { left: 'var(--tooltip-position-start)' }]" 
          class="fl-ww-pv-slider__tooltip"
        >
          {{ value }}
        </div>

        <template v-if="content.isTooltip && isRange">
          <div 
            :style="[tooltipStyle, { left: content.isEditableTooltip ? '40px' : 'var(--tooltip-position-start-center)' }]" 
            class="fl-ww-pv-slider__tooltip"
          >
            <InputText 
              v-if="content.isEditableTooltip"
              size="small" 
              :value="content.isLogScale ? formatLogValue(value[0]) : value[0]"
              @input="handleInputChange(0, $event.target.value)"
              style="width: 80px; fontSize:10px" 
            />
            <span
              v-if="!content.isEditableTooltip">
              {{ content.isLogScale ? formatLogValue(value[0]) : value[0] }}
            </span>
          </div>
          <div 
            :style="[tooltipStyle, content.isEditableTooltip ? {paddingRight:'0px',right:'-40px'} : { left: 'var(--tooltip-position-end-center)' }]" 
            class="fl-ww-pv-slider__tooltip"
          >
            <InputText 
              v-if="content.isEditableTooltip"
              size="small" 
              :value="content.isLogScale ? formatLogValue(value[1]) : value[1]"
              @input="handleInputChange(1, $event.target.value)"
              style="width: 80px; fontSize:10px; paddingRight:0px; marginRight:0px" 
            />
            <span
              v-if="!content.isEditableTooltip">
              {{ content.isLogScale ? formatLogValue(value[1]) : value[1] }}
            </span>
          </div>
        </template>

        <!-- The Slider (Now Inside the Same Wrapper as Tooltips) -->
        <Slider 
          v-model="value"
          :step="step"
          :range="isRange"
          :min="min"
          :max="max"
          :class="{ editing: isEditing }"
          :pt="{
            range: {
              style:{
                'background-color':this.content.globalStyle.rangeBackgroundColor
              }
            },
            handle: {
              style:{
                'background-color':this.content.globalStyle.selectorBorderColor
              }
            },
            startHandler: {
              style:{
                'background-color':this.content.globalStyle.selectorBorderColor
              }
            },
            endHandler: {
              style:{
                'background-color':this.content.globalStyle.selectorBorderColor
              }
            }
          }"
          @update:modelValue="handleManualInput"
        />
      </div>

      <!-- Max Badge (After Slider) -->
      <Badge 
        v-if="content.isLimits"
        class="fl-ww-pv-slider__badge fl-ww-pv-slider__badge--right"
        :value="content.max"
        :pt="{
          root:{
            style:{
              'background-color':this.content.globalStyle.limitBackgroundColor,
              'color':this.content.globalStyle.limitTextColor
            }
          }
        }" />

    </div>

  </div>
</template>



<script>
import { computed, watch } from 'vue';
import Slider from 'primevue/slider';
import Badge from 'primevue/badge';
import InputText from 'primevue/inputtext';
// import InputText from 'primevue/inputtext';
import PrimeVue from 'primevue/config'
import Noir from './Noir.js';

export default {
  beforeCreate: function () {
    this.$.appContext.app.use(PrimeVue, {
        unstyled:false,
        theme: {
            preset: Noir,
            options: {
                prefix: 'p',
                // darkModeSelector: '.p-dark',
                cssLayer: false,
            }
        }
    })
    this.$.appContext.app.component('Slider', Slider)
    this.$.appContext.app.component('Badge', Badge)
    this.$.appContext.app.component('InputText', InputText)
    // this.$.appContext.app.component('InputText', InputText)
  },
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    wwElementState: { type: Object, required: true },
  },
  emits: ['trigger-event'],
  setup(props) {
    const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'value',
      type: props.content.isRange ? 'array' : 'number',
      defaultValue: computed(() => {
        const toFloat = (val) => Number(val) || 0.00000001;

        if (props.content.isLogScale) {
          if (props.content.isRange) {
            return Array.isArray(props.content.value)
              ? props.content.value.map(val => Math.log(Math.max(toFloat(val), 0.00000001)))
              : [Math.log(1), Math.log(100)];
          } else {
            return Math.log(Math.max(toFloat(props.content.value), 0.00000001));
          }
        } else {
          if (props.content.isRange) {
            return Array.isArray(props.content.value)
              ? props.content.value.map(toFloat)
              : [20, 60];
          } else {
            return toFloat(props.content.value) || 30;
          }
        }
      }),
    });

    return { variableValue, setValue };
  },
  computed: {
      isEditing() {
        return false;
      },
      step() {
        return this.content.isLogScale ? this.content.logStep : this.content.step;
      },
      max() {
        return this.content.isLogScale ? Math.log(this.content.max) : this.content.max;
      },
      min() {
        return this.content.isLogScale ? (this.content.min < 0.01 ? -2 : Math.log(this.content.min)) : this.content.min;
      },
      isRange() {
        return this.content.isRange ? this.content.isRange : false;
      },
      value : {
        get() {
          return this.variableValue;
        },
        set(newValue) {
          const updatedValue = Array.isArray(newValue) ? [...newValue] : newValue;
          this.setValue(updatedValue);

          // Transform log → linear before emitting
          const emittedValue = this.content.isLogScale
            ? Array.isArray(updatedValue)
              ? updatedValue.map(v => Math.exp(v))
              : Math.exp(updatedValue)
            : updatedValue;

          this.$emit('trigger-event', { name: 'change', event: { value: emittedValue } });
        }
      },

      // cssVars() {
      //   let ratioStart, ratioEnd;
      //   const min = Number(this.content.min) || 0;
      //   const max = this.content.max!==undefined ? Number(this.content.max) : 100;

      //   if (this.isRange && Array.isArray(this.value)) {
      //     ratioStart = ((this.value[0] - min) / (max - min)) * 100;
      //     ratioEnd = ((this.value[1] - min) / (max - min)) * 100;
      //   } else {
      //     const singleValue = this.value!==undefined ? Number(this.value) : min; // Ensure single value mode works
      //     ratioStart = ((singleValue - min) / (max - min)) * 100;
      //     ratioEnd = ratioStart; // Single value mode, both positions are the same
      //   }

      //   return {
      //     "--tooltip-position-start": `calc(${ratioStart}% - 50px)`,
      //     "--tooltip-position-end": `${ratioEnd}%`,
      //     "--selector-background": this.content.globalStyle.selectorBackgroundColor,
      //     "--text-color": this.content.globalStyle.textColor,
      //   };
      // },
      tooltipStyle() {
        let ratioStart, ratioEnd;
        // const min = Number(this.min) || 0;
        // const max = this.max!==undefined ? Number(this.max) : 100;

        if (this.isRange && Array.isArray(this.value)) {
          ratioStart = (this.value[0] - this.min) / (this.max - this.min);
          ratioEnd = (this.value[1] - this.min) / (this.max - this.min);
        } else {
          const singleValue = this.value!==undefined ? Number(this.value) : this.min;
          ratioStart = (singleValue - this.min) / (this.max - this.min);
          ratioEnd = ratioStart; // Single value mode
        }

        return {
          fontSize: this.content.globalStyle.fontSize,
          fontFamily: this.content.globalStyle.fontFamily,
          "--tooltip-background": this.content.globalStyle.tooltipBackground,
          "--tooltip-text-color": this.content.globalStyle.tooltipTextColor,
          "--tooltip-position-start": `calc(${ratioStart * 100}% - 50px)`,
          "--tooltip-position-start-center": `${ratioStart * 100}%`,
          "--tooltip-position-end": `calc(${ratioEnd * 100}% + 50px)`,
          "--tooltip-position-end-center": `${ratioEnd * 100}%`
        };
      }
  },
  watch: {
    'content.value'(newValue) {
      let parsedVal;

      const toFloat = (val) => {
        const floatVal = parseFloat(val);
        return isNaN(floatVal) ? 0 : floatVal;
      };

      if (this.content.isLogScale) {
        if (this.content.isRange) {
          parsedVal = Array.isArray(newValue)
            ? newValue.map(val => Math.log(Math.max(toFloat(val), 0.00000001))) // clamp > 0
            : [Math.log(1), Math.log(10)];
        } else {
          parsedVal = Math.log(Math.max(toFloat(newValue), 0.00000001));
        }
      } else {
        if (this.content.isRange) {
          parsedVal = Array.isArray(newValue)
            ? newValue.map(toFloat)
            : [20, 60];
        } else {
          parsedVal = toFloat(newValue) || 30;
        }
      }

      if (JSON.stringify(parsedVal) === JSON.stringify(this.value)) return;

      this.setValue(parsedVal);
      this.$emit('trigger-event', { name: 'initValueChange', event: { value: parsedVal } });
    }
  },
  methods: {

    handleInputChange(index, inputValue) {
      // Strip commas and parse to number
      let numeric = Number(inputValue.replace(/,/g, '')) || 0;

      // Default fallback if input is missing or invalid
      if (!inputValue || numeric <= 0) {
        numeric = 1; // Linear fallback
      }

      // If in log scale, convert to log space
      if (this.content.isLogScale) {
        numeric = Math.max(numeric, 0.00000001); // Avoid log(0)
        numeric = Math.log(numeric);
      }

      // Update the appropriate index of the value array
      const newValue = [...this.value];
      newValue[index] = numeric;
      this.value = newValue; // Will trigger setter logic
    },

    formatLogValue(logValue) {
      const linearValue = Math.exp(logValue);
      
      // If it's essentially an integer (like 1000.0000001), format as integer
      if (Number.isInteger(linearValue)) {
        return linearValue.toLocaleString();
      }

      // Else format with up to 2 decimal places and commas
      return linearValue.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: this.content.logDecimalPoints,
      });
    },

    onEnter(index, inputValue) {

      console.log(this.content.isLogScale);
      console.log(this.isLogScale);

      const numericValue = Number(inputValue) || 0;
      const min = Number(this.min);
      const max = Number(this.max);

      let updatedValue = [...this.value];

      // Clamp the entered value within min/max
      let clampedValue = Math.min(Math.max(numericValue, min), max);

      let step;

      step = this.step;

      // Enforce range constraints
      if (index === 0) {
        clampedValue = Math.min(clampedValue, updatedValue[1] - step);
      } else if (index === 1) {
        clampedValue = Math.max(clampedValue, updatedValue[0] + step);
      }

      updatedValue[index] = clampedValue;

      this.value = updatedValue;
    },

    updateInputValue(index, inputValue) {
      const numericValue = Number(inputValue) || 0;
      const newValue = [...this.value];
      newValue[index] = numericValue;
      this.value = newValue; // Using computed setter
    },

    handleManualInput(newValue) {

      let formattedValue;

      console.log(newValue);
      
      if (this.content.isLogScale) {

        if (this.content.isRange) {
          formattedValue = Array.isArray(newValue)
            ? newValue.map((val) => Number(val) || 0)
            : [1.3, 1.78];
        } else {
          formattedValue = isNaN(newValue) ? 1.477: Number(newValue);
        }

      } else {

        if (this.content.isRange) {
          formattedValue = Array.isArray(newValue)
            ? newValue.map((val) => Number(val) || 0)
            : [20, 60];
        } else {
          formattedValue = isNaN(newValue) ? 30: Number(newValue);
        }

      }

      if (JSON.stringify(formattedValue) === JSON.stringify(this.value)) return;

      this.setValue(formattedValue);
      const emittedValue = this.content.isLogScale
        ? Array.isArray(formattedValue)
          ? formattedValue.map(v => Math.exp(v))
          : Math.exp(formattedValue)
        : formattedValue;

      this.$emit("trigger-event", { name: "change", event: { value: emittedValue } });
    }

    // handleManualInput(newValue) {
    //   const formattedValue = this.isRange
    //     ? newValue.map((val) => Number(val) || 0)
    //     : Number(newValue) || 0;

    //   this.value = formattedValue;
    // },
  }
};
</script>

<style lang="scss" scoped>
.fl-ww-pv-slider {
    position: relative;
    width: 100%;
    font-family: inherit;
    border: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Wrapper for Min Badge, Slider, and Max Badge (Inline) */
.fl-ww-pv-slider__wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Ensures min/max stay on either side */
    gap: 10px;
}

/* Ensure Slider Stretches Fully */
.fl-ww-pv-slider__slider-container {
    flex-grow: 1; /* Makes slider take up the available space */
    position: relative;
    /*width: calc(100% - 200px);  for potential tooltips and ranges
    margin: 0 auto;  */
}

/* PrimeVue Slider Full Width */
.fl-ww-pv-slider__slider-container > .p-slider {
    width: 100%;
}

/* Tooltip Styling */
.fl-ww-pv-slider__tooltip {
    visibility: visible;
    background-color: var(--tooltip-background);
    color: var(--tooltip-text-color);
    text-align: center;
    padding: 5px 0px;
    border-radius: 6px;
    position: absolute;
    z-index: 20;
    top: -7px; /* Move closer to draggable ball */
    transform: translateX(-50%) translateY(-100%);
}

/* Tooltip Positions (Now Correctly Inside the Slider Container) */
.fl-ww-pv-slider__tooltip:first-child {
    left: var(--tooltip-position-start);
}

.fl-ww-pv-slider__tooltip:last-child {
    left: var(--tooltip-position-end);
}

/* Min & Max Badges (Kept Inline for Proper Alignment) */
.fl-ww-pv-slider__badge {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap; /* Prevents the badge from wrapping */
}

.p-slider-range {
  background-color:red !important;
}

</style>