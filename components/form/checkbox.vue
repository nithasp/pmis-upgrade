<template>
   <UCheckbox color="primary" :label="label" @change="changeCheckbox" :model-value="checkedValue" :ui="{
      form: 'cursor-pointer select-none',
      label: 'cursor-pointer select-none',
      border: 'border-gray-100',
   }" :disabled="disabled" />
   <p class="text-xs text-grayy-75 ml-7" v-if="subLabel">{{ subLabel }}</p>
</template>
<script setup>
const props = defineProps({
   label: String,
   modelValue: Boolean,
   disabled: Boolean,
   subLabel: String,
   onChange: Function
});

const emit = defineEmits(["update:modelValue"]);
const checkedValue = ref(props.modelValue);
watch(
   () => props.modelValue,
   (newValue) => {
      checkedValue.value = newValue;
   }
);

const changeCheckbox = (value) => {
   emit("update:modelValue", value);
   props.onChange(value)
};
</script>
