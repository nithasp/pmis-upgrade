<script setup>
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import { ref, watch } from "vue";

const props = defineProps({
  placeholder: String,
  customIcon: {
    type: [Object, Array, String, Number, Boolean, Function, Symbol],
  },
  name: String,
  label: String,
  value: String,
  disabled: Boolean,
  error: {
    type: [String, Boolean],
    default: "",
  },
  icon: String,
  isView: {
    type: Boolean,
    default: false,
  },
  suffix: String,
  onBlur: Function,
  onChange: Function,
  noSpinner: {
    type: Boolean,
    default: false,
  },
  helpText: String,
  decimalPlaces: {
    type: [Number, String],
    default: 2, // Default decimal places
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
});

// Define the internal state for the component
const internalValue = ref(props.modelValue);

// Internal state for the formatted value
const formattedValue = ref(formatValue(props.modelValue));

// Emit changes back to the parent component
const emit = defineEmits(["update:modelValue", "blur"]);

watch(
  () => props.modelValue,
  (newValue) => {
    formattedValue.value = formatValue(newValue);
  }
);

const handleKeypress = (event) => {
  const char = event.key;
  const inputElement = event.target;
  const currentValue = inputElement.value;
  const cursorPosition = inputElement.selectionStart;
  const selectionEnd = inputElement.selectionEnd;
  const isReplacing = cursorPosition !== selectionEnd; // Detect if replacing selected text

  // Allow numbers, backspace, one decimal point, and a leading minus sign
  if (!/[\d.-]/.test(char)) {
    event.preventDefault();
    return;
  }

  // Prevent multiple decimal points
  if (char === "." && currentValue.includes(".") && !isReplacing) {
    event.preventDefault();
    return;
  }

  // Allow minus only at the start
  if (char === "-" && cursorPosition !== 0) {
    event.preventDefault();
    return;
  }

  // Handle decimal places limit
  if (currentValue.includes(".")) {
    const [integerPart, decimalPart] = currentValue.split(".");
    
    // Prevent typing more than allowed decimal places
    if (char !== "-" && char !== "." && decimalPart && decimalPart.length >= props.decimalPlaces && cursorPosition > currentValue.indexOf(".") && !isReplacing) {
      event.preventDefault();
    }
  }

  // Handle replacing selected text
  if (isReplacing) {
    const newValue =
      currentValue.slice(0, cursorPosition) + char + currentValue.slice(selectionEnd);
    
    // Prevent invalid replacements (e.g., multiple dots)
    if (newValue.split(".").length > 2 || (newValue.includes("-") && newValue.indexOf("-") !== 0)) {
      event.preventDefault();
    }
  }
};


// Format value for display
function formatValue(value) {
  if (value == null || value === "") return "";
  const number = parseFloat(value);
  if (isNaN(number)) return value;
  return number.toLocaleString("en-US", {
    minimumFractionDigits: props.decimalPlaces,
    maximumFractionDigits: props.decimalPlaces,
  });
}

function onBlur(event) {
  const inputElement = event.target;
  let inputValue = inputElement.value.replace(/,/g, "");

  if (!inputValue.includes(".")) {
    const decimals = "0".repeat(props.decimalPlaces);
    inputValue = `${inputValue}.${decimals}`;
  } else {
    const [integerPart, decimalPart] = inputValue.split(".");
    const fixedDecimalPart = (decimalPart || "")
      .padEnd(props.decimalPlaces, "0")
      .slice(0, props.decimalPlaces);
    inputValue = `${integerPart}.${fixedDecimalPart}`;
  }

  if (typeof inputValue !== 'number') {
    inputValue = inputElement.value.replace(/,/g, "");
  }

  formattedValue.value = formatValue(inputValue);

  // Emit a number instead of a string
  emit("update:modelValue", parseFloat(inputValue) || inputValue);
  emit("blur", event);
}

// Handle focus to select all text
function onFocus(event) {
  event.target.select();
}
</script>


<template>
  <UFormGroup :label="label" :name="name" :error="error">
    <template #default="{ error }">
      <UInput v-if="!isView" :icon="icon" v-model="formattedValue" :value="formattedValue" size="md"
        :variant="disabled ? 'none' : 'outline'" color="purple" :placeholder="placeholder" :disabled="disabled"
        :type="'text'" @blur="onBlur" @change="onChange" @focus="onFocus" autocomplete="Off" @keypress="handleKeypress"
        :ui="{ wrapper: `rounded-md ${disabled ? 'bg-[#D0D5DD] text-grayy-75' : 'bg-white'}` }"
        :class="{ noSpinner: 'no-spinner' }">
        <template v-if="customIcon" #leading>
          <NuxtIcon :name="customIcon" size="xl" />
        </template>

        <template v-if="error || suffix" #trailing>
          <NuxtIcon v-if="error && !suffix" name="exclamation" color="text-error-500" />
          <span v-if="suffix">{{ suffix }}</span>
        </template>
        <template v-if="helpText" #help>
          <span class="text-[#F04438]">
            {{ helpText }}
          </span>
        </template>
      </UInput>
      <p class="text-grayy-75" v-else-if="value">
        {{ value ? value : "-" }}
      </p>
      <p class="text-grayy-75" v-else>
        {{ formattedValue ? formattedValue : "-" }}
      </p>
      <p v-if="helpText" class="text-[#F04438]">
        {{ helpText ? helpText : "-" }}
      </p>
    </template>
  </UFormGroup>
</template>

<style scoped>
/* Hide spinner for numeric inputs */
.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-spinner {
  -moz-appearance: textfield;
  /* For Firefox */
}
</style>
