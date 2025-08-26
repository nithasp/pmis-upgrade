<template>
   <UFormGroup :label="label" :name="name" :error="error">
      <template #default="{ error }">
         <UInput size="md" variant="outline" color="purple" :placeholder="placeholder" v-model="internalValue"
            :type="isPasswordDisplay ? 'text' : 'password'" :disabled="disabled" @blur="onBlur">
            <template v-if="customIcon" #leading>
               <NuxtIcon :name="customIcon" size="xl" />
            </template>
            <template #trailing>
               <NuxtIcon :name="isPasswordDisplay ? 'eye-crossed' : 'eye'" color="text-grayy-75"
                  class="cursor-pointer pointer-events-auto" @click="isPasswordDisplay = !isPasswordDisplay" />
            </template>
            <!-- <template v-if="error" #trailing>
                    <NuxtIcon name="exclamation" color="text-error-500" />
            </template> -->
         </UInput>
      </template>
   </UFormGroup>
</template>
<script setup>
import { ref, watch } from "vue";
import NuxtIcon from "../ui/nuxtIcon.vue";
const isPasswordDisplay = ref(false);
const props = defineProps({
   placeholder: String,
   modelValue: [String, Number],
   customIcon: {
      type: [Object, Array, String, Number, Boolean, Function, Symbol],
   },
   name: String,
   label: String,
   disabled: Boolean,
   error: {
      type: [String, Boolean],
      default: "",
   },
   onBlur: Function
});
// Define the internal state for the component
const internalValue = ref(props.modelValue);

// Emit the changes back to the parent component
const emit = defineEmits(["update:modelValue"]);
watch(internalValue, (newValue) => {
   emit("update:modelValue", newValue);
});
</script>
<style scoped></style>
