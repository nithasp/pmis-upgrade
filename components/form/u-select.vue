<template>
   <UFormGroup :label="label" :name="name">
      <USelectMenu v-if="!isView" size="md" variant="outline" color="purple" v-model="internalValue"
         :value="value ? value : modelValue" :options="options" :placeholder="placeholder"
         :value-attribute="valueAttribute" :option-attribute="optionAttribute" :searchable="searchable"
         :searchable-placeholder="searchablePlaceholder"
         :ui="{ wrapper: `rounded-md ${disabled ? 'bg-[#D0D5DD] text-grayy-75' : 'bg-white'}` }" @change="onChange"
         :disabled="disabled">
         <template v-if="customIcon" #leading>
            <NuxtIcon :name="customIcon" size="xl" />
         </template>
         <template #trailing>
            <span v-if="suffix" class="text-grayy-400">{{ suffix }}</span>
            <UIcon name="i-heroicons-chevron-down-20-solid" class="w-5 h-5" />
         </template>
      </USelectMenu>
      <p class="text-grayy-75" v-else>{{ valueDisplay ? valueDisplay : "-" }}</p>
      <template v-if="textHistory > 0">
         <span class="text-[#F04438]">
            {{ textHistoryValue }} (เดิม)
         </span>
      </template>
   </UFormGroup>
</template>
<script setup>
import { ref, watch } from "vue";
import NuxtIcon from "../ui/nuxtIcon.vue";
const props = defineProps({
   placeholder: {
      type: String,
      default: "Select...",
   },
   options: {
      type: Array,
      required: false,
   },
   modelValue: {
      type: [String, Number, Object, Boolean],
      default: null,
   },
   customIcon: {
      type: [Object, Array, String, Number, Boolean, Function, Symbol],
   },
   name: String,
   label: String,
   value: String,
   suffix: String,
   searchable: {
      type: Boolean,
      default: false,
   },
   searchablePlaceholder: {
      type: String,
      default: "Search...",
   },
   isView: {
      type: Boolean,
      default: false,
   },
   optionAttribute: {
      type: String,
      default: "name",
   },
   valueAttribute: {
      type: String,
      default: "id",
   },
   textHistory: Number,
   onChange: Function,
   disabled: Boolean,
});
const internalValue = ref(props.modelValue);
const valueDisplay = ref(props.modelValue);
const textHistoryValue = ref(props.textHistory)

// Emit the changes back to the parent component
const emit = defineEmits(["update:modelValue"]);
watch(internalValue, (newValue) => {
   emit("update:modelValue", newValue);
   if (props.isView) {
      valueDisplay.value = renderValueDisplay(newValue);
      console.log('props.textHistory=>', props.textHistory)
      if (props.textHistory) {
         textHistoryValue.value = renderValueDisplay(props.textHistory);
      }
   }
});

onMounted(() => {
   if (props.isView) {
      valueDisplay.value = renderValueDisplay(internalValue.value);
      if (props.textHistory) {
         textHistoryValue.value = renderValueDisplay(props.textHistory);
      }
   }
});

const renderValueDisplay = (value) => {
   const findData = props.options.find((e) => e.id === value);
   if (findData) {
      return findData.name;
   }
   return value;
};
// Watch for changes from the parent to sync with local state
watch(
   () => props.modelValue,
   async (newValue) => {
      if (props.isView) {
         const findData = await props.options.find((e) => e.id === newValue);
         if (findData) {
            valueDisplay.value = findData.name;

         }
         internalValue.value = newValue;
         if (props.textHistory) {
            textHistoryValue.value = renderValueDisplay(props.textHistory);
         }
      } else {
         internalValue.value = newValue;
      }
   }
);

watch(
   () => props.options,
   async (newValue) => {
      if (props.isView) {
         valueDisplay.value = renderValueDisplay(internalValue.value);
         if (props.textHistory) {
            textHistoryValue.value = renderValueDisplay(props.textHistory);
         }
      }
   }
);
</script>
<style scoped></style>
