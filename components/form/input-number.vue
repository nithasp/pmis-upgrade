<template>
   <UFormGroup :label="label" :name="name" :required="required">
      <UInput v-if="!isView" variant="outline" color="purple" v-model="internalValue" :placeholder="placeholder"
         :disabled="disabled" @input="handleInput" @blur="handleBlur" :ui="{ base: 'h-9' }">
         <template #trailing>
            <span v-if="suffix">{{ suffix }}</span>
         </template>
      </UInput>
      <p class="text-grayy-75" v-else-if="modelValue">
         {{ modelValue ? modelValue : "-" }}
      </p>
   </UFormGroup>
</template>

<script setup>
const props = defineProps({
   label: String,
   name: String,
   disabled: Boolean,
   required: {
      type: Boolean,
      default: false,
   },
   placeholder: {
      type: String,
      default: "0",
   },
   modelValue: {
      type: [String, Number],
      default: "",
   },
   decimal: {
      type: Number,
      default: 0,
   },
   suffix: {
      type: String,
      default: "",
   },
   isView: {
      type: Boolean,
      default: false,
   },
});

const emit = defineEmits(["update:modelValue"]);
const internalValue = ref(props.modelValue);
const handleInput = (event) => {
   const ele = event.target;
   let val = ele.value;
   val = val.replace(/[^0-9.]/g, "");

   const dotIndex = val.indexOf(".");
   if (dotIndex !== -1) {
      const beforeDot = val.slice(0, dotIndex);
      const afterDot = val.slice(dotIndex + 1).replace(/\./g, "");
      val = `${beforeDot}.${afterDot}`;
   }

   let [integerPart, decimalPart = ""] = val.split(".");
   integerPart = integerPart.replace(/^0+(?!$)/, "");

   const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   let formattedValue = formattedInteger;

   if (decimalPart || dotIndex !== -1) {
      formattedValue += `.${decimalPart}`;
   }

   if (props.decimal > 0 && decimalPart.length > props.decimal) {
      formattedValue = `${formattedInteger}.${decimalPart.substring(0, props.decimal)}`;
   }

   const cursorPosition = ele.selectionStart;
   const prevLength = ele.value.length;
   ele.value = formattedValue;
   const newLength = ele.value.length;
   const adjustedCursorPosition = cursorPosition + (newLength - prevLength);
   ele.setSelectionRange(adjustedCursorPosition, adjustedCursorPosition);

   internalValue.value = ele.value;
   emit("update:modelValue", ele.value);
};

const handleBlur = (event) => {
   const ele = event.target;
   let val = ele.value?.replace(/,/g, "");
   if (!val) return;
   const [integerPart, decimalPart = ""] = val.split(".");
   const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   const fixedDecimals = decimalPart.padEnd(props.decimal, "0");
   ele.value = props.decimal > 0 ? `${formattedInteger}.${fixedDecimals}` : formattedInteger;

   internalValue.value = ele.value;
   emit("update:modelValue", ele.value);
};

watch(
   () => props.modelValue,
   (newValue) => {
      internalValue.value = newValue;
   }
);
</script>
