<!-- :ui="{
   wrapper: `border-[1px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] 
   ${errorMsg ? 'border-[2px] border-[#F7A29B] -mb-1' : 'border-[#9477B6]'} 
   rounded-lg focus:!ring-0`,
   base: `focus:!ring-0`,
}" -->
<template>
   <UFormGroup :label="label" :name="name" :error="error">
      <template #default="{ error }">
         <UInput
            v-if="!isView"
            :icon="icon"
            v-model="internalValue"
            :value="value ? value : modelValue"
            size="md"
            :variant="disabled ? 'none' : 'outline'"
            color="purple"
            :placeholder="placeholder"
            :disabled="disabled"
            :type="type"
            @blur="onBlur"
            @change="onChange"
            :ui="{ wrapper: `rounded-md ${disabled ? 'bg-[#D0D5DD] text-grayy-75' : 'bg-white'}` }"
            :class="{ noSpinner: 'no-spinner' }"
         >
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
            {{ value ? value : "-" }} {{ suffix }}
         </p>
         <p class="text-grayy-75" v-else="value">
            {{ internalValue ? (float ? threeDigit? formatNumber(internalValue,3) : formatNumber(internalValue) : internalValue) : "-" }} {{ suffix }}
         </p>
         <p v-if="helpText" class="text-[#F04438]">
            {{ helpText ? helpText : "-" }}
         </p>
      </template>
   </UFormGroup>
</template>

<script setup>
import NuxtIcon from "~/components/ui/nuxtIcon.vue";

const props = defineProps({
   placeholder: String,
   modelValue: {
      type: [String, Number],
      default: null,
   },
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
   type: String,
   suffix: String,
   onBlur: Function,
   onChange: Function,
   noSpinner: {
      type: Boolean,
      default: false,
   },
   helpText: String,
   float: Boolean,
   threeDigit: Boolean,
});
// Define the internal state for the component
const internalValue = ref(props.modelValue);

// Emit the changes back to the parent component
const emit = defineEmits(["update:modelValue"]);
watch(internalValue, (newValue) => {
   emit("update:modelValue", newValue);
});

watch(
   () => props.modelValue,
   (newValue) => {
      internalValue.value = newValue;
   }
);
</script>

<style scoped>
/* ซ่อนลูกศรสำหรับ input type number ในทุกเบราว์เซอร์ */
.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
   -webkit-appearance: none;
   margin: 0;
}

.no-spinner {
   -moz-appearance: textfield;
   /* สำหรับ Firefox */
}
</style>
