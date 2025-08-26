<template>
    <UFormGroup :label="label" :name="name">
        <UInputMenu v-if="!isView" size="md" variant="outline" color="purple" v-model="internalValue"
            :value="value ? value : modelValue" :options="options" :placeholder="placeholder"
            :value-attribute="valueAttribute" :search="search" option-attribute="name"
            :ui="{ wrapper: 'rounded-md bg-white' }">
            <template v-if="customIcon" #leading>
                <NuxtIcon :name="customIcon" size="xl" />
            </template>
        </UInputMenu>
        <p class="text-grayy-75" v-else>{{ valueDisplay ? valueDisplay : '-' }}</p>
        <p v-if="helpText" class="text-[#F04438]">
            {{ helpText ? helpText : '-' }}
        </p>
    </UFormGroup>
</template>
<script setup>
import { ref, watch } from 'vue';
import NuxtIcon from '../ui/nuxtIcon.vue';
const props = defineProps({
    placeholder: {
        type: String,
        default: 'Select...'
    },
    options: {
        type: Array,
        required: false,
        default: []
    },
    modelValue: {
        type: [String, Number],
        default: null
    },
    customIcon: {
        type: [Object, Array, String, Number, Boolean, Function, Symbol],
    },
    name: String,
    label: String,
    value: String,
    isView: {
        type: Boolean,
        default: false
    },
    search: Function,
    helpText: String,
    valueAttribute: {
        type: String,
        default: "id",
    },
});
const internalValue = ref(props.modelValue);
const valueDisplay = ref(props.modelValue)

// Emit the changes back to the parent component
const emit = defineEmits(['update:modelValue']);
watch(internalValue, (newValue) => {
    emit('update:modelValue', newValue);
});

// Watch for changes from the parent to sync with local state
watch(() => props.modelValue, async (newValue) => {
    if (props.isView) {
        const findData = await props.options.find(e => e.id === newValue)
        if (findData) {
            valueDisplay.value = findData.name
        } else {
            valueDisplay.value = newValue
        }
        internalValue.value = newValue;
    } else {
        internalValue.value = newValue;
    }
});

watch(() => props.options, async (newValue) => {
    if (props.isView) {
        const findData = await newValue.find(e => e.id === internalValue.value)
        if (findData) {
            valueDisplay.value = findData.name
        }
    }
});

</script>
<style scoped></style>
