<!-- :ui="{
   wrapper: `border-[1px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] 
   ${errorMsg ? 'border-[2px] border-[#F7A29B] -mb-1' : 'border-[#9477B6]'} 
   rounded-lg focus:!ring-0`,
   base: `focus:!ring-0`,
}" -->
<template>
    <UFormGroup :label="label" :name="name" :error="error">
        <template #default="{ error }">
            <UTextarea v-if="!isView" v-model="internalValue" :value="value ? value : modelValue" size="md"
                :variant="disabled ? 'none' : 'outline'" color="purple" :placeholder="placeholder" :disabled="disabled"
                :type="type" @blur="onBlur" :rows="rows" :maxrows="maxrows" autoresize :resize="resize"
                :ui="{ wrapper: `rounded-md ${disabled ? 'bg-[#D0D5DD] text-grayy-75' : 'bg-white'}` }">
            </UTextarea>
            <p class="text-grayy-75" v-else>
                {{ internalValue ? internalValue : '-' }}
            </p>
        </template>
    </UFormGroup>
</template>

<script setup>

const props = defineProps({
    placeholder: String,
    modelValue: {
        type: [String, Number],
        default: null
    },
    name: String,
    label: String,
    value: String,
    disabled: Boolean,
    error: {
        type: [String, Boolean],
        default: ''
    },
    isView: {
        type: Boolean,
        default: false
    },
    type: String,
    onBlur: Function,
    rows: {
        type: Number,
        default: 3
    },
    maxrows: {
        type: Number,
        default: 10
    },
    resize : {
        type: Boolean,
        default: false
    }
});
// Define the internal state for the component
const internalValue = ref(props.modelValue);

// Emit the changes back to the parent component
const emit = defineEmits(["update:modelValue"]);
watch(internalValue, (newValue) => {
    emit("update:modelValue", newValue);
});

watch(() => props.modelValue, (newValue) => {
    internalValue.value = newValue;
});
</script>

<style scoped></style>
