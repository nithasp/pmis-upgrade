<template>
   <UFormGroup :label="label" :name="name">
      <USelectMenu
         v-model="selectedValues"
         :options="options"
         :placeholder="placeholder"
         :multiple="multiple"
         :value-attribute="valueAttribute"
         :option-attribute="optionAttribute"
         :search-attributes="searchAttributes"
         :searchable="searchable"
         :ui="{ wrapper: `rounded-md ${disabled ? 'bg-[#D0D5DD] text-grayy-75' : 'bg-white'}` }"
         size="md"
         variant="outline"
         color="purple"
         :disabled="disabled"
         @change="handleChange"
      >
         <template #label>
            <span v-if="selectedLabel" class="truncate">
               {{ selectedLabel }}
            </span>
         </template>
      </USelectMenu>
   </UFormGroup>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
   label: { type: String, required: true },
   name: String,
   options: {
      type: Array as () => Array<any>,
      required: true,
   },
   placeholder: { type: String, default: "Select an option" },
   multiple: { type: Boolean, default: false },
   valueAttribute: { type: String, default: "id" },
   optionAttribute: { type: String, default: "name" },
   searchAttributes: { type: Array, default: () => ["name"] },
   modelValue: { type: [Array, String, Number], required: true },
   disabled: Boolean,
   searchable: Boolean
});

const emits = defineEmits(["update:modelValue"]);
const selectedValues = ref<any>(props.modelValue);
const selectedLabel = computed(() => {
   if (props.multiple && Array.isArray(selectedValues.value)) {
      if (selectedValues.value.length === 0) return "";
      return props.options
         .filter((option: any) => selectedValues.value.includes(option[props.valueAttribute]))
         .map((option: any) => option[props.optionAttribute])
         .join(", ");
   } else if (!props.multiple) {
      const selectedOption = props.options.find((option: any) => option[props.valueAttribute] === selectedValues.value);
      return selectedOption ? selectedOption[props.optionAttribute] : "";
   }
   return "";
});

const handleChange = (value: any) => {
   selectedValues.value = value;
   emits("update:modelValue", value);
};

watch(
   () => props.modelValue,
   (newValue) => {
      selectedValues.value = newValue;
      emits("update:modelValue", newValue);
   }
);
</script>
